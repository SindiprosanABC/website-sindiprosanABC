import { transporter } from "@/emailSettings/config";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.formData();

  // Renomeando para 'resume' para corresponder ao nome do input no formulário
  const resumeFile = body.get("resume") as File | null;

  if (!resumeFile) {
    return new Response("Currículo não foi anexado.", { status: 400 });
  }

  // Converte o ArrayBuffer do arquivo para um Buffer
  const fileArrayBuffer = await resumeFile.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);

  // Mapeia os dados do formulário para variáveis mais claras
  const name = body.get("name") as string;
  const email = body.get("email") as string;
  const category = body.get("category") as string;
  const phone = body.get("phone") as string;
  const message = body.get("message") as string;

  const emailTemplate = {
    name,
    email,
    category,
    phone,
    message,
  };

  const mailMessage = {
    // O remetente (FROM) deve ser a mesma conta usada para autenticar
    from: {
      name: "Contato Site - Sindi Prosan",
      address: "sindiprosan-abc@sindiprosan-abc.org.br",
    },
    // O destinatário (TO) é o próprio e-mail do cliente
    to: "sindiprosan-abc@sindiprosan-abc.org.br",
    subject: `Email de contato - Assunto: ${emailTemplate.category}`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contato Recebido</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #2e4b89;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Novo Contato via Formulário</h2>
          <h3>Dados enviados pelo usuário:</h3>
          <ul>
            <li><strong>Nome:</strong> ${emailTemplate.name}</li>
            <li><strong>E-mail:</strong> ${emailTemplate.email}</li>
            <li><strong>Telefone:</strong> ${emailTemplate.phone}</li>
            <li><strong>Assunto:</strong> ${emailTemplate.category}</li>
            <li><strong>Mensagem:</strong> ${emailTemplate.message}</li>
          </ul>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: resumeFile.name,
        content: fileBuffer,
        contentType: resumeFile.type,
      },
    ],
  };

  try {
    const sendEmail = await transporter.sendMail(mailMessage);
    return new Response(`Email enviado com sucesso: ${sendEmail.response}`, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(`Erro ao enviar email: ${error.message}`, {
      status: 400,
    });
  }
}
