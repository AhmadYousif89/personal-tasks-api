"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPasswordValid = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let IsPasswordValid = class IsPasswordValid {
    async validate(value) {
        const isPasswordValid = /^((?!.*[\s])(?=.*\d).{3,})/.test(value);
        return isPasswordValid ? true : false;
    }
    defaultMessage() {
        throw new common_1.HttpException('required at least 3 characters with numbers and no spaces', common_1.HttpStatus.BAD_REQUEST);
    }
};
IsPasswordValid = __decorate([
    (0, common_1.Injectable)(),
    (0, class_validator_1.ValidatorConstraint)({ name: 'IsPasswordValid', async: true })
], IsPasswordValid);
exports.IsPasswordValid = IsPasswordValid;
//# sourceMappingURL=password.validator.js.map