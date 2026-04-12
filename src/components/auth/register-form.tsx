"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { registerSchema, type RegisterInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Captcha {
  token: string
  question: string
  sig: string
}

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [captcha, setCaptcha] = useState<Captcha | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const [captchaError, setCaptchaError] = useState("")
  const honeypotRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  })

  const fetchCaptcha = useCallback(async () => {
    const res = await fetch("/api/captcha")
    if (res.ok) {
      const data = await res.json()
      setCaptcha(data)
      setCaptchaAnswer("")
      setCaptchaError("")
    }
  }, [])

  useEffect(() => {
    fetchCaptcha()
  }, [fetchCaptcha])

  const onSubmit = async (data: RegisterInput) => {
    if (!captcha) {
      toast.error("CAPTCHA yüklenemedi, sayfayı yenileyin")
      return
    }
    if (!captchaAnswer.trim()) {
      setCaptchaError("Lütfen güvenlik sorusunu cevaplayın")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          _hp: honeypotRef.current?.value ?? "",
          captchaToken: captcha.token,
          captchaAnswer,
          captchaSig: captcha.sig,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          toast.error("Bu e-posta adresi zaten kayıtlı.")
        } else if (result.message?.includes("CAPTCHA")) {
          setCaptchaError("Güvenlik kodu hatalı, lütfen tekrar deneyin")
          fetchCaptcha()
        } else if (result.errors) {
          const firstError = Object.values(result.errors)[0]
          toast.error(Array.isArray(firstError) ? firstError[0] as string : "Geçersiz bilgiler.")
        } else {
          toast.error(result.message || "Kayıt sırasında bir hata oluştu.")
        }
        return
      }

      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.")
      router.push("/giris")
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyiniz.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Kayıt Ol</CardTitle>
        <CardDescription>Yeni bir hesap oluşturun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad</Label>
              <Input
                id="name"
                placeholder="Adınız"
                {...register("name")}
                aria-invalid={!!errors.name}
                className="h-10"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Soyad</Label>
              <Input
                id="surname"
                placeholder="Soyadınız"
                {...register("surname")}
                aria-invalid={!!errors.surname}
                className="h-10"
              />
              {errors.surname && (
                <p className="text-sm text-destructive">{errors.surname.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">E-posta</Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="ornek@email.com"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              className="h-10"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-password">Şifre</Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="h-10"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Şifre Tekrar</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              {...register("passwordConfirm")}
              aria-invalid={!!errors.passwordConfirm}
              className="h-10"
            />
            {errors.passwordConfirm && (
              <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
            )}
          </div>

          {/* Honeypot */}
          <input
            ref={honeypotRef}
            type="text"
            name="_xfield"
            tabIndex={-1}
            autoComplete="new-password"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0, overflow: "hidden" }}
          />

          {/* CAPTCHA */}
          <div className="space-y-2">
            <Label>Güvenlik Doğrulaması</Label>
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
              {captcha ? (
                <>
                  <span className="font-mono text-base font-semibold text-foreground select-none">
                    {captcha.question}
                  </span>
                  <Input
                    type="number"
                    placeholder="Cevap"
                    value={captchaAnswer}
                    onChange={(e) => { setCaptchaAnswer(e.target.value); setCaptchaError("") }}
                    className="h-9 w-24 text-center font-mono"
                  />
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    Yenile
                  </button>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Yükleniyor...</span>
              )}
            </div>
            {captchaError && <p className="text-sm text-destructive">{captchaError}</p>}
          </div>

          <Button type="submit" className="w-full h-10" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kayıt yapılıyor...
              </>
            ) : (
              "Kayıt Ol"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-primary font-medium hover:underline">
            Giriş Yap
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
