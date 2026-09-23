export interface ExecutionResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  compileCode: number | null;
  exitCode: number | null;
  signal: string | null;
}

interface PistonStage {
  stdout?: string;
  stderr?: string;
  output?: string;
  code?: number | null;
  signal?: string | null;
}

interface PistonResponse {
  message?: string;
  compile?: PistonStage;
  run?: PistonStage;
}

const endpoint = process.env.PISTON_URL || "https://emkc.org/api/v2/piston/execute";
const cppVersion = process.env.PISTON_CPP_VERSION || "*";

export async function executeCpp(code: string, stdin: string): Promise<ExecutionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        language: "c++",
        version: cppVersion,
        files: [{ name: "main.cpp", content: code }],
        stdin,
        compile_timeout: 10_000,
        run_timeout: 3_000,
        compile_memory_limit: 256_000_000,
        run_memory_limit: 256_000_000,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Execution service returned ${response.status}`);
    }

    const payload = (await response.json()) as PistonResponse;
    if (payload.message) throw new Error(payload.message);

    const compileOutput = payload.compile?.stderr || payload.compile?.output || "";
    const run = payload.run || {};
    return {
      stdout: run.stdout || "",
      stderr: run.stderr || "",
      compileOutput,
      compileCode: payload.compile?.code ?? null,
      exitCode: run.code ?? null,
      signal: run.signal ?? null,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Execution service timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
