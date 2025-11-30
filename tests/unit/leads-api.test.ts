import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/leads/route";
import { NextRequest } from "next/server";

const { mockSupabase, mockCreateServiceRoleClient } = vi.hoisted(() => {
  const mockSupabaseInstance = {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  };

  const mockCreate = vi.fn(() => mockSupabaseInstance);

  return {
    mockSupabase: mockSupabaseInstance,
    mockCreateServiceRoleClient: mockCreate,
  };
});

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: mockCreateServiceRoleClient,
}));

describe("Leads API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate email format", async () => {
    const request = new NextRequest("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify({ email: "invalid-email" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid email address");
  });

  it("should accept valid email", async () => {
    const { createServiceRoleClient } = await import("@/lib/supabase/server");
    const supabase = createServiceRoleClient();

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: "123", email: "test@example.com", created_at: new Date() },
            error: null,
          }),
        }),
      }),
    });

    const request = new NextRequest("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
      headers: new Headers({ "content-type": "application/json" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Email saved successfully");
  });

  it("should handle duplicate email gracefully", async () => {
    const { createServiceRoleClient } = await import("@/lib/supabase/server");
    const supabase = createServiceRoleClient();

    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: "23505", message: "Duplicate key" },
          }),
        }),
      }),
    });

    const request = new NextRequest("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify({ email: "existing@example.com" }),
      headers: new Headers({ "content-type": "application/json" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Email already registered");
  });
});
