"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const password = await bcrypt.hash('Password123!', 12);
    const alice = await prisma.user.upsert({
        where: { email: 'alice@projectflow.dev' },
        update: {},
        create: { name: 'Alice Johnson', email: 'alice@projectflow.dev', password },
    });
    const bob = await prisma.user.upsert({
        where: { email: 'bob@projectflow.dev' },
        update: {},
        create: { name: 'Bob Martinez', email: 'bob@projectflow.dev', password },
    });
    const carlos = await prisma.user.upsert({
        where: { email: 'carlos@projectflow.dev' },
        update: {},
        create: { name: 'Carlos Rivera', email: 'carlos@projectflow.dev', password },
    });
    const team = await prisma.team.upsert({
        where: { slug: 'engineering-team-demo' },
        update: {},
        create: {
            name: 'Engineering Team',
            description: 'Main product engineering team',
            slug: 'engineering-team-demo',
            members: {
                create: [
                    { userId: alice.id, role: client_1.Role.ADMIN },
                    { userId: bob.id, role: client_1.Role.MANAGER },
                    { userId: carlos.id, role: client_1.Role.DEVELOPER },
                ],
            },
        },
    });
    const project1 = await prisma.project.upsert({
        where: { id: 'demo-project-1' },
        update: {},
        create: {
            id: 'demo-project-1',
            name: 'Website Redesign',
            description: 'Complete redesign of the marketing website',
            status: 'ACTIVE',
            teamId: team.id,
        },
    });
    await prisma.project.upsert({
        where: { id: 'demo-project-2' },
        update: {},
        create: {
            id: 'demo-project-2',
            name: 'Mobile App v2',
            description: 'Second version of the mobile application',
            status: 'ACTIVE',
            teamId: team.id,
        },
    });
    const tasks = [
        { title: 'Design new landing page', status: client_1.TaskStatus.DONE, priority: client_1.TaskPriority.HIGH, assigneeId: alice.id, position: 0 },
        { title: 'Implement authentication flow', status: client_1.TaskStatus.IN_PROGRESS, priority: client_1.TaskPriority.URGENT, assigneeId: bob.id, position: 1 },
        { title: 'Write API documentation', status: client_1.TaskStatus.TODO, priority: client_1.TaskPriority.MEDIUM, assigneeId: carlos.id, position: 2 },
        { title: 'Setup CI/CD pipeline', status: client_1.TaskStatus.IN_REVIEW, priority: client_1.TaskPriority.HIGH, assigneeId: alice.id, position: 3 },
        { title: 'Performance optimization', status: client_1.TaskStatus.BACKLOG, priority: client_1.TaskPriority.LOW, assigneeId: null, position: 4 },
        { title: 'Mobile responsive fixes', status: client_1.TaskStatus.TODO, priority: client_1.TaskPriority.MEDIUM, assigneeId: bob.id, position: 5 },
    ];
    for (const task of tasks) {
        await prisma.task.create({
            data: {
                title: task.title,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId,
                position: task.position,
                projectId: project1.id,
                creatorId: alice.id,
                description: `Task description for: ${task.title}`,
            },
        }).catch(() => { });
    }
    console.log('\nSeed complete!');
    console.log('Demo accounts (password: Password123!):');
    console.log('  alice@projectflow.dev  — Admin');
    console.log('  bob@projectflow.dev    — Manager');
    console.log('  carlos@projectflow.dev — Developer');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map