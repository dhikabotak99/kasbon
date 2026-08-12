export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Terjadi kesalahan yang tidak diketahui.";
}
