import { NextResponse } from "next/server";

type CaptchaEntry = {
  answer: number;
  expires: number;
};

const captchaStore = new Map<string, CaptchaEntry>();
const CAPTCHA_TTL = 5 * 60 * 1000;

export const dynamic = "force-dynamic";

function clearExpiredCaptchas() {
  const now = Date.now();

  for (const [key, value] of captchaStore.entries()) {
    if (value.expires < now) {
      captchaStore.delete(key);
    }
  }
}

/**
 * GET /api/captcha
 * 生成一条简单的数学验证码。
 */
export async function GET() {
  clearExpiredCaptchas();

  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const answer = num1 + num2;
  const question = `${num1} + ${num2} = ?`;
  const id = crypto.randomUUID();

  captchaStore.set(id, {
    answer,
    expires: Date.now() + CAPTCHA_TTL
  });

  return NextResponse.json(
    {
      id,
      question
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

/**
 * POST /api/captcha
 * 校验验证码答案是否正确。
 */
export async function POST(request: Request) {
  try {
    clearExpiredCaptchas();

    const body = (await request.json()) as {
      id?: string;
      answer?: string | number;
    };

    const id = body.id?.trim();
    const answer = `${body.answer ?? ""}`.trim();

    if (!id || !answer) {
      return NextResponse.json({ valid: false, error: "缺少验证码参数" }, { status: 400 });
    }

    const captcha = captchaStore.get(id);

    if (!captcha) {
      return NextResponse.json({ valid: false, error: "验证码已过期" }, { status: 400 });
    }

    if (captcha.expires < Date.now()) {
      captchaStore.delete(id);
      return NextResponse.json({ valid: false, error: "验证码已过期" }, { status: 400 });
    }

    const isValid = Number.parseInt(answer, 10) === captcha.answer;

    if (isValid) {
      captchaStore.delete(id);
    }

    return NextResponse.json({ valid: isValid });
  } catch {
    return NextResponse.json({ valid: false, error: "验证码校验失败" }, { status: 500 });
  }
}
