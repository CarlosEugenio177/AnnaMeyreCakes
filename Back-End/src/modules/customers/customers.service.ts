import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomerContactDto } from './dto/customer-contact.dto';

const CUSTOMER_SESSION_COOKIE = 'amc_customer_session';
const SESSION_DAYS = 180;

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  async upsertFromContact(dto: CustomerContactDto) {
    const phone = this.normalizePhone(dto.customerPhone);
    const data = {
      name: dto.customerName.trim(),
      phone,
      email: dto.customerEmail?.trim() || null,
      address: dto.customerAddress?.trim() || null,
      lastSeenAt: new Date(),
    };

    return this.prisma.customer.upsert({
      where: { phone },
      update: data,
      create: data,
    });
  }

  async createSession(customerId: string): Promise<string> {
    const token = randomBytes(48).toString('base64url');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

    await this.prisma.customerSession.create({
      data: {
        customerId,
        tokenHash,
        expiresAt,
      },
    });

    return token;
  }

  setSessionCookie(response: Response, token: string): void {
    response.cookie(CUSTOMER_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  clearSessionCookie(response: Response): void {
    response.clearCookie(CUSTOMER_SESSION_COOKIE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }

  readSessionToken(cookieHeader?: string): string | undefined {
    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const sessionCookie = cookies.find((cookie) =>
      cookie.startsWith(`${CUSTOMER_SESSION_COOKIE}=`),
    );

    return sessionCookie
      ? decodeURIComponent(sessionCookie.split('=').slice(1).join('='))
      : undefined;
  }

  async findCustomerBySessionToken(token: string): Promise<Customer | null> {
    const session = await this.prisma.customerSession.findFirst({
      where: {
        tokenHash: this.hashToken(token),
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { customer: true },
    });

    if (!session) {
      return null;
    }

    await this.prisma.customer.update({
      where: { id: session.customerId },
      data: { lastSeenAt: new Date() },
    });

    return session.customer;
  }

  async revokeCurrentSession(request: Request): Promise<void> {
    const token = this.readSessionToken(request.headers.cookie);

    if (!token) {
      return;
    }

    await this.prisma.customerSession.updateMany({
      where: {
        tokenHash: this.hashToken(token),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  getProfile(customer: Customer) {
    return this.toPublicCustomer(customer);
  }

  async getOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: this.orderInclude(),
    });
  }

  async getOrder(customerId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, customerId },
      include: this.orderInclude(),
    });

    if (!order) {
      throw new NotFoundException('Pedido nao encontrado');
    }

    return order;
  }

  async getReorderPayload(customerId: string, id: string) {
    const order = await this.getOrder(customerId, id);
    const cakeItem = order.items.find((item) => item.cakeDetail);
    const sweetItems = order.items.filter((item) => item.sweetDetail);

    return {
      cake: cakeItem?.cakeDetail
        ? {
            doughId: cakeItem.cakeDetail.doughId,
            cakeSizeId: cakeItem.cakeDetail.cakeSizeId,
            filling1Id: cakeItem.cakeDetail.filling1Id,
            filling2Id: cakeItem.cakeDetail.filling2Id,
            toppingId: cakeItem.cakeDetail.toppingId,
          }
        : null,
      sweets: sweetItems.map((item) => ({
        sweetTypeId: item.sweetDetail!.sweetTypeId,
        quantity: item.sweetDetail!.quantity,
        sweetFlavorIds: item.sweetDetail!.flavors.map(
          (flavor) => flavor.sweetFlavorId,
        ),
      })),
      notes: order.notes,
    };
  }

  toContactSnapshot(dto: CustomerContactDto): Prisma.InputJsonObject {
    return {
      name: dto.customerName.trim(),
      phone: this.normalizePhone(dto.customerPhone),
      email: dto.customerEmail?.trim() ?? null,
      address: dto.customerAddress?.trim() ?? null,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private toPublicCustomer(customer: Customer) {
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      lastSeenAt: customer.lastSeenAt,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private orderInclude() {
    return {
      customer: true,
      items: {
        include: {
          cakeDetail: true,
          sweetDetail: {
            include: {
              flavors: true,
            },
          },
        },
      },
      payments: true,
    };
  }
}
