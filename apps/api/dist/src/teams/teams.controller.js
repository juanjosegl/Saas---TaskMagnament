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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const teams_service_1 = require("./teams.service");
const create_team_dto_1 = require("./dto/create-team.dto");
const invite_member_dto_1 = require("./dto/invite-member.dto");
const update_member_role_dto_1 = require("./dto/update-member-role.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TeamsController = class TeamsController {
    constructor(teamsService) {
        this.teamsService = teamsService;
    }
    create(user, dto) {
        return this.teamsService.create(user.id, dto);
    }
    findMyTeams(user) {
        return this.teamsService.findMyTeams(user.id);
    }
    getMyInvitations(user) {
        return this.teamsService.getMyInvitations(user.id);
    }
    findOne(teamId, user) {
        return this.teamsService.findOne(teamId, user.id);
    }
    invite(teamId, user, dto) {
        return this.teamsService.inviteMember(teamId, user.id, dto);
    }
    getInvitation(token) {
        return this.teamsService.getInvitationByToken(token);
    }
    acceptInvitation(token, user) {
        return this.teamsService.acceptInvitation(token, user.id);
    }
    updateRole(teamId, memberId, user, dto) {
        return this.teamsService.updateMemberRole(teamId, user.id, memberId, dto);
    }
    removeMember(teamId, memberId, user) {
        return this.teamsService.removeMember(teamId, user.id, memberId);
    }
};
exports.TeamsController = TeamsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "findMyTeams", null);
__decorate([
    (0, common_1.Get)('my-invitations'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "getMyInvitations", null);
__decorate([
    (0, common_1.Get)(':teamId'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':teamId/invite'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, invite_member_dto_1.InviteMemberDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "invite", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('invitations/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "getInvitation", null);
__decorate([
    (0, common_1.Post)('invitations/:token/accept'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Patch)(':teamId/members/:memberId/role'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_member_role_dto_1.UpdateMemberRoleDto]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)(':teamId/members/:memberId'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], TeamsController.prototype, "removeMember", null);
exports.TeamsController = TeamsController = __decorate([
    (0, swagger_1.ApiTags)('Teams'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('teams'),
    __metadata("design:paramtypes", [teams_service_1.TeamsService])
], TeamsController);
//# sourceMappingURL=teams.controller.js.map