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
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let TasksController = class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    getMyTasks(user) {
        return this.tasksService.getMyTasks(user.id);
    }
    create(projectId, user, dto) {
        return this.tasksService.create(projectId, user.id, dto);
    }
    findByProject(projectId, user) {
        return this.tasksService.findByProject(projectId, user.id);
    }
    findOne(taskId, user) {
        return this.tasksService.findOne(taskId, user.id);
    }
    update(taskId, user, dto) {
        return this.tasksService.update(taskId, user.id, dto);
    }
    remove(taskId, user) {
        return this.tasksService.remove(taskId, user.id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Get)('tasks/mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my assigned tasks' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "getMyTasks", null);
__decorate([
    (0, common_1.Post)('projects/:projectId/tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a task in a project' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('projects/:projectId/tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks in a project' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)('tasks/:taskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task details' }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('tasks/:taskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a task' }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('tasks/:taskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task' }),
    __param(0, (0, common_1.Param)('taskId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TasksController.prototype, "remove", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map