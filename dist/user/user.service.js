"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const argon = require("argon2");
const cloudinary_1 = require("../cloudinary/cloudinary");
const prisma_service_1 = require("./../prisma/prisma.service");
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllUsers() {
        try {
            const users = await this.prisma.user.findMany({});
            if (users.length === 0)
                throw new common_1.HttpException('Found no users', common_1.HttpStatus.NOT_FOUND);
            for (const user of users) {
                this.deleteUserHash(user);
            }
            return users;
        }
        catch (err) {
            throw err;
        }
    }
    async getUserById(id) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user)
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            if (user && !user.rT)
                throw new common_1.HttpException('Access denied, Deleted RT', common_1.HttpStatus.FORBIDDEN);
            this.deleteUserHash(user);
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async updateUserById(id, dto) {
        const { name, email, password, image } = dto;
        if (!name && !email && !password && !image)
            return {};
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const imgFlag = user.id.split('-')[0] + '_image';
            let uploadedImage;
            if (image) {
                if (!image.includes(';base64,'))
                    throw new common_1.HttpException('image is not valid', common_1.HttpStatus.BAD_REQUEST);
                uploadedImage = await cloudinary_1.default.uploader.upload(image, {
                    overwrite: true,
                    public_id: imgFlag,
                    upload_preset: 'Personal_Tasks',
                });
            }
            const passwordMatchs = await argon.verify(user.hash, password);
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    image: image ? uploadedImage.secure_url : user.image,
                    hash: passwordMatchs ? user.hash : await argon.hash(password),
                },
            });
            this.deleteUserHash(updatedUser);
            return updatedUser;
        }
        catch (err) {
            throw err;
        }
    }
    async deleteUserById(id) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user)
                throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
            await this.prisma.user.delete({ where: { id } });
            return { message: 'User deleted' };
        }
        catch (err) {
            throw err;
        }
    }
    deleteUserHash(user) {
        delete user.hash;
        delete user.rT;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map