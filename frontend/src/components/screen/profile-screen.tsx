// components/screen/profile-screen.tsx
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Key,
  LogOut,
  Mail,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ProfileScreenProps {
  user: any;
  updatePassword: ({
    old_password,
    new_password,
  }: {
    old_password: string;
    new_password: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
}

export default function ProfileScreen({
  user,
  updatePassword,
  logout,
}: ProfileScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate current password
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Senha atual é obrigatória";
    }

    // Validate new password
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nova senha é obrigatória";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Senha deve ter pelo menos 8 caracteres";
    }

    // Validate password confirmation
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Por favor, confirme sua nova senha";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      setIsLoading(true);

      try {
        await updatePassword({
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        });

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Show success toast
        toast("Senha Atualizada", {
          description: "Sua senha foi atualizada com sucesso.",
        });

        // Close dialog
        document
          .querySelector('[data-state="open"]')
          ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      } catch (error: any) {
        // Show error toast
        toast("Atualização Falhou", {
          description:
            "Ocorreu um erro ao atualizar sua senha. Por favor, tente novamente.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Voltar ao Painel</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src="/placeholder.svg?height=128&width=128"
                    alt={user.full_name}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.full_name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja sair?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Você será desconectado da sua conta PagCore neste
                      dispositivo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={logout}>Sair</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>

          {/* Profile Details Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Visualize e gerencie os detalhes da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Nome Completo
                    </div>
                    <p className="font-medium">{user.full_name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      Endereço de Email
                    </div>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Nome de Usuário
                    </div>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      CPF
                    </div>
                    <p className="font-medium">{user.cpf}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Membro Desde
                    </div>
                    <p className="font-medium">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Segurança</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Key className="mr-2 h-4 w-4" />
                    Senha
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">••••••••</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Alterar Senha
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Alterar Senha</DialogTitle>
                          <DialogDescription>
                            Digite sua senha atual e uma nova senha para
                            atualizar suas credenciais.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={handlePasswordSubmit}
                          className="space-y-4 py-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Senha Atual</Label>
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type="password"
                              placeholder="Digite sua senha atual"
                              className={
                                errors.currentPassword ? "border-red-500" : ""
                              }
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                            />
                            {errors.currentPassword && (
                              <p className="text-sm text-red-500">
                                {errors.currentPassword}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type="password"
                              placeholder="Digite sua nova senha"
                              className={
                                errors.newPassword ? "border-red-500" : ""
                              }
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                            />
                            {errors.newPassword && (
                              <p className="text-sm text-red-500">
                                {errors.newPassword}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirme a Nova Senha
                            </Label>
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              placeholder="Confirme sua nova senha"
                              className={
                                errors.confirmPassword ? "border-red-500" : ""
                              }
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                            />
                            {errors.confirmPassword && (
                              <p className="text-sm text-red-500">
                                {errors.confirmPassword}
                              </p>
                            )}
                          </div>
                          <DialogFooter className="mt-6">
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? "Atualizando..." : "Atualizar Senha"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
