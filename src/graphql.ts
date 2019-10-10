/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum DiscountType {
    PERCENT = "PERCENT",
    DEDUCT = "DEDUCT"
}

export class DiscountInput {
    name?: string;
    type?: DiscountType;
    value?: number;
}

export class PaymentSlipInput {
    name?: string;
    price?: number;
}

export class UserCreateInput {
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    roleId?: string;
}

export class Customer {
    _id?: string;
    name?: string;
    dateOfBirth?: number;
    phone?: string;
    email?: string;
    points?: number;
    createdAt?: number;
    createdBy?: User;
}

export class Discount {
    _id?: string;
    name?: string;
    type?: DiscountType;
    value?: number;
    createdAt?: number;
    createdBy?: User;
    startDate?: number;
    endDate?: number;
    isActive?: boolean;
}

export abstract class IMutation {
    abstract createUser(userCreateInput?: UserCreateInput): string | Promise<string>;

    abstract createPaymentSlip(input?: PaymentSlipInput): string | Promise<string>;

    abstract createDiscount(input?: DiscountInput): string | Promise<string>;
}

export class PaymentSlip {
    _id?: string;
    name?: string;
    price?: number;
    createdAt?: number;
    createdBy?: User;
}

export class Permission {
    _id?: string;
    code?: string;
    name?: string;
}

export abstract class IQuery {
    abstract user(id: string): User | Promise<User>;

    abstract users(ids: string[]): User[] | Promise<User[]>;

    abstract customer(id: string): Customer | Promise<Customer>;

    abstract customers(ids: string[]): Customer[] | Promise<Customer[]>;

    abstract room(id: string): Room | Promise<Room>;

    abstract rooms(ids: string[]): Room[] | Promise<Room[]>;

    abstract paymentSlip(id: string): PaymentSlip | Promise<PaymentSlip>;

    abstract paymentSlips(ids: string[]): PaymentSlip[] | Promise<PaymentSlip[]>;

    abstract discount(id: string): Discount | Promise<Discount>;

    abstract discounts(): Discount[] | Promise<Discount[]>;
}

export class Role {
    _id?: string;
    code?: string;
    name?: string;
    permissions?: Permission[];
}

export class Room {
    _id?: string;
    name?: string;
    createdAt?: number;
    typeRoom?: TypeRoom;
    isActive?: boolean;
}

export class TypeRoom {
    _id?: string;
    name?: string;
    createdAt?: number;
}

export class User {
    _id?: string;
    username?: string;
    password?: string;
    email?: string;
    name?: string;
    createdAt?: number;
    role?: Role;
    isActive?: boolean;
}
