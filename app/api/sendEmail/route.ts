import nodemailer from "nodemailer"; // Importa o Nodemailer
import { NextRequest } from "next/server";

// NÃO inicialize o Nodemailer aqui fora da função
// porque ele precisa ser criado a cada chamada para usar as variáveis de ambiente
// ou as credenciais dinâmicas do ambiente de execução.

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();

    const name = body.get("name") as string;
    const email = body.get("email") as string;
    const phone = body.get("phone") as string;
    const category = body.get("category") as string;
    const message = body.get("message") as string;
    const resumeFile = body.get("resume") as File | null;

    if (!resumeFile) {
      return new Response("Currículo não foi anexado.", { status: 400 });
    }

    const fileArrayBuffer = await resumeFile.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);
    // Para Nodemailer, geralmente passamos o Buffer diretamente, não o Base64
    // const fileBase64 = fileBuffer.toString("base64");

    // --- CONFIGURAÇÃO DO TRANSPORTER COM GMAIL SMTP ---
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // false para STARTTLS na porta 587
      auth: {
        // Use o seu novo e-mail Gmail e a senha de app de 16 dígitos
        user: "sindiprosan5@gmail.com", // <--- SEU NOVO EMAIL GMAIL
        pass: process.env.GMAIL_APP_PASSWORD, // <--- Sua SENHA DE APP DO GMAIL (adicione no .env.local e Vercel)
      },
    });

    const mailMessage = {
      // --- REMETENTE: O novo e-mail Gmail ---
      from: "Sindi Prosan Teste <sindiprosan5@gmail.com>",

      // --- DESTINATÁRIO: O e-mail do cliente UOL Mail Pro ---
      to: "sindiprosan5@gmail.com",

      subject: `Contato do Site (Teste via Gmail) - Assunto: ${category}`,
      html: `
        <h3>Novo Contato Recebido (Teste via Gmail):</h3>
        <ul>
          <li><strong>Nome:</strong> ${name}</li>
          <li><strong>E-mail:</strong> ${email}</li>
          <li><strong>Telefone:</strong> ${phone}</li>
          <li><strong>Assunto:</strong> ${category}</li>
          <li><strong>Mensagem:</strong> ${message}</li>
        </ul>
      `,
      attachments: [
        {
          filename: resumeFile.name,
          content: fileBuffer, // Nodemailer aceita Buffer diretamente aqui
          contentType: resumeFile.type,
        },
      ],
    };

    // --- Envia o e-mail usando o Nodemailer ---
    await transporter.sendMail(mailMessage);

    console.log("Email enviado com sucesso (via Gmail SMTP)!");
    return new Response("Email enviado com sucesso!", { status: 200 });
  } catch (error: any) {
    console.error("Erro geral na API (Nodemailer/Gmail):", error);
    // Adapte a mensagem de erro para ser mais útil em caso de falha
    return new Response(
      `Erro ao enviar e-mail: ${error.message || "Erro desconhecido no servidor."}`,
      { status: 500 },
    );
  }
}
