import { createContext, ReactNode, useContext } from "react"
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query"
import { User, LoginUser } from "@shared/schema"
import queryClient, { apiRequest } from "../lib/queryClient"
import { useToast } from "@/hooks/use-toast"

// Define the User type without the password for client
export type AuthUser = Omit<User, "password">

type RegisterData = {
  username: string
  email: string
  password: string
}

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  error: Error | null
  loginMutation: UseMutationResult<AuthUser, Error, LoginUser>
  logoutMutation: UseMutationResult<void, Error, void>
  registerMutation: UseMutationResult<AuthUser, Error, RegisterData>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()

  // Get current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<AuthUser | null, Error>({
    queryKey: ["/auth/me"],
  })

  // Login with email and password
  const loginMutation = useMutation<AuthUser, Error, LoginUser>({
    mutationFn: async (credentials: LoginUser) => {
      return await apiRequest<AuthUser>("POST", "/api/auth/login", credentials)
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/auth/me"], userData)
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Register new user
  const registerMutation = useMutation<AuthUser, Error, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      return await apiRequest<AuthUser>("POST", "/api/auth/register", userData)
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["/auth/me"], userData)
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.username}!`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Logout user
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiRequest<void>("POST", "/api/auth/logout")
    },
    onSuccess: () => {
      queryClient.setQueryData(["/auth/me"], null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
