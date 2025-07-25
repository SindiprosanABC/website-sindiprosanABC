import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const fileBase64 = fileBuffer.toString("base64");

    // Envia o e-mail usando o Resend
    const { data, error } = await resend.emails.send({
      // O 'from' deve ser um e-mail VERIFICADO no seu domínio no Resend
      from: "Contato do Site <sindiprosan5@gmail.com>",
      // 'to' é um array, mesmo que seja apenas um destinatário
      to: ["sindiprosan-abc@sindiprosan-abc.org.br"], // Para o próprio cliente Sindi Prosan
      subject: `Contato do Site - Assunto: ${category}`,
      html: `
        <h3>Novo Contato Recebido:</h3>
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
          content: fileBase64, // Anexo em Base64
        },
      ],
    });

    if (error) {
      console.error("Erro ao enviar e-mail via Resend:", error);
      // Adapte a mensagem de erro conforme a necessidade
      return new Response(
        `Erro ao enviar e-mail: ${error.message || "Erro desconhecido no envio."}`,
        { status: 400 },
      );
    }

    console.log("Email enviado com sucesso via Resend:", data);
    return new Response("Email enviado com sucesso!", { status: 200 });
  } catch (error: any) {
    console.error("Erro geral na API:", error);
    return new Response(
      `Erro geral na API: ${error.message || "Erro desconhecido no servidor."}`,
      { status: 500 },
    );
  }
}
