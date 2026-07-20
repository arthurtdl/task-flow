// prisma/seed.ts
import { PrismaClient, Prisma, TaskStatus, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'; // ou '@prisma/adapter-pg' dependendo de qual pacote você instalador no seu package.json
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Inicializa o Pool e o Adapter exatamente como no seu backend principal
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // Limpa os dados existentes
  await prisma.attachment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('teste123', 10);

  // Criando os usuários e encadeando os relacionamentos no mesmo formato de CreateInput da imagem
  const userData: Prisma.UserCreateInput[] = [
    {
      name: 'Admin',
      email: 'admin@teste.com',
      passwordHash,
      role: Role.ADMIN,
      tasks: {
        create: [
          {
            title: 'Aprovar novos acessos',
            status: TaskStatus.PENDING,
            isPriority: true,
            attachments: {
              create: [
                {
                  fileName: 'lista_acessos.pdf',
                  fileUrl: 'https://storage.example.com/lista_acessos.pdf',
                  fileType: 'application/pdf',
                }
              ]
            }
          }
        ]
      }
    },
    {
      name: 'João',
      email: 'joao@teste.com',
      passwordHash,
      role: Role.USER,
      tasks: {
        create: [
          {
            title: 'Finalizar relatório financeiro',
            description: 'Analisar métricas do Q3 e montar apresentação.',
            status: TaskStatus.IN_PROGRESS,
            isPriority: true,
            deadline: new Date(new Date().setDate(new Date().getDate() + 5)),
          },
          {
            title: 'Atualizar documentação da API',
            status: TaskStatus.BACKLOG,
            isPriority: false,
          }
        ]
      }
    }
  ];

  // Insere os dados usando a estrutura que você montou
  for (const user of userData) {
    const createdUser = await prisma.user.create({ data: user });
    console.log(`👤 Usuário criado: ${createdUser.email} com suas respectivas tasks.`);
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Fecha o pool do adapter também para o processo não ficar travado
  });