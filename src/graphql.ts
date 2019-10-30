/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum TypeDiscount {
    PERCENT = "PERCENT",
    DEDUCT = "DEDUCT"
}


export enum TypeService {
    TIME = "TIME",
    NUMS = "NUMS"
}

export class DiscountInput {
    name?: string;
    type?: TypeDiscount;
    value?: number;
}

export class PaymentSlipInput {
    name?: string;
    price?: number;
}

export class PermissionInput {
    code: string;
    name: string;
}

export class ServiceInput {
    name: string;
    price: number;
    type: TypeService;
}

export class RoleInput {
    code: string;
    name: string;
    permissions: string[];
}

export class UserCreateInput {
    username: string;
    password: string;
    email: string;
    name: string;
    roleId: string;
}

export class UserUpdateInput {
    currentPassword?: string;
    newPassword?: string;
    email?: string;
    name?: string;
    roleId?: string;
}

export class Bill {
    _id?: string;
    customer?: Customer;
    createdAt?: number;
    createdBy?: User;
    roomDetails?: BillRoomDetails[];
    serviceDetails?: BillServiceDetails[];
    total?: number;
}

export class BillRoomDetails {
    room?: Room;
    startTime?: number;
    endTime?: number;
    total?: number;
}

export class BillServiceDetails {
    service?: Service;
    startTime?: number;
    endTime?: number;
    quantity?: number;
    total?: number;
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
    type?: TypeDiscount;
    value?: number;
    createdAt?: number;
    createdBy?: User;
    startDate?: number;
    endDate?: number;
    isActive?: boolean;
}

export class LoginResponse {
    token?: string;
}

export abstract class IMutation {
    abstract createUser(input: UserCreateInput): User | Promise<User>;

    abstract login(username: string, password: string): LoginResponse | Promise<LoginResponse>;

    abstract updateUser(userId: string, input: UserUpdateInput): boolean | Promise<boolean>;

    abstract deleteUser(userId: string): boolean | Promise<boolean>;

    abstract createPaymentSlip(input?: PaymentSlipInput): string | Promise<string>;

    abstract createDiscount(input?: DiscountInput): string | Promise<string>;

    abstract createPermission(input: PermissionInput): Permission | Promise<Permission>;

    abstract updatePermission(permissionId: string, input: PermissionInput): Permission | Promise<Permission>;

    abstract deletePermission(permissionId: string): boolean | Promise<boolean>;

    abstract createRole(input: RoleInput): Role | Promise<Role>;

    abstract updateRole(roleId: string, input: RoleInput): Role | Promise<Role>;

    abstract deleteRole(roleId: string): boolean | Promise<boolean>;
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

    abstract users(): User[] | Promise<User[]>;

    abstract permissions(): Permission[] | Promise<Permission[]>;

    abstract roles(): Role[] | Promise<Role[]>;

    abstract role(roleId: string): Role | Promise<Role>;

    abstract customer(id: string): Customer | Promise<Customer>;

    abstract customers(ids: string[]): Customer[] | Promise<Customer[]>;

    abstract room(id: string): Room | Promise<Room>;

    abstract rooms(ids: string[]): Room[] | Promise<Room[]>;

    abstract paymentSlip(id: string): PaymentSlip | Promise<PaymentSlip>;

    abstract paymentSlips(ids: string[]): PaymentSlip[] | Promise<PaymentSlip[]>;

    abstract discount(id: string): Discount | Promise<Discount>;

    abstract discounts(): Discount[] | Promise<Discount[]>;

    abstract bill(id: string): Bill | Promise<Bill>;

    abstract services(): Service[] | Promise<Service[]>;

    abstract service(serviceId: string): Service | Promise<Service>;
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

export class Service {
    _id?: string;
    name?: string;
    type?: TypeService;
    unitPrice?: number;
}

export class TypeRoom {
    _id?: string;
    name?: string;
    unitPrice?: number;
    updatedAt?: number;
}

export class User {
    _id?: string;
    username?: string;
    email?: string;
    name?: string;
    createdAt?: number;
    role?: Role;
    isActive?: boolean;
}
