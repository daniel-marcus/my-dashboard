import { render, screen, cleanup } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { useAuth0 } from "@auth0/auth0-react"
import { Login } from "@/components/login"

vi.mock("next/navigation", () => ({ usePathname: () => "/" }))
vi.mock("@auth0/auth0-react", () => ({ useAuth0: vi.fn() }))

const mockAuth = (overrides: Partial<ReturnType<typeof useAuth0>>) =>
  vi.mocked(useAuth0).mockReturnValue({
    isAuthenticated: false,
    error: undefined,
    loginWithRedirect: vi.fn(),
    ...overrides,
  } as ReturnType<typeof useAuth0>)

beforeEach(() => {
  process.env.NEXT_PUBLIC_AUTH0_DOMAIN = "test.auth0.com"
})

afterEach(cleanup)

describe("Login", () => {
  it("shows login button when not authenticated", () => {
    mockAuth({ isAuthenticated: false })
    render(<Login />)
    expect(screen.queryByRole("button", { name: /login/i })).not.toBeNull()
  })

  it("hides login button when authenticated", () => {
    mockAuth({ isAuthenticated: true })
    render(<Login />)
    expect(screen.queryByRole("button", { name: /login/i })).toBeNull()
  })

  it("shows login button when auth token is expired", () => {
    mockAuth({
      isAuthenticated: true,
      error: new Error("login_required"),
    })
    render(<Login />)
    expect(screen.queryByRole("button", { name: /login/i })).not.toBeNull()
  })
})
