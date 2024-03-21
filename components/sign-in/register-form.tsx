"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { StrongPasswordOptions, isStrongPassword } from "validator";
import z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

const strongPasswordOptions: StrongPasswordOptions & {
  returnScore?: false | undefined;
} = {
  minLength: 8,
  minNumbers: 1,
  minSymbols: 1,
  minLowercase: 1,
  minUppercase: 1,
  returnScore: false,
};

const weakPasswordErrorMessage = `Password must include at least ${strongPasswordOptions.minLength} characters, ${strongPasswordOptions.minNumbers} number(s), ${strongPasswordOptions.minSymbols} symbol(s) and lower/upper case letters.`;

const schema = z
  .object({
    username: z.string().min(4),
    email: z.string().email(),
    password: z
      .string()
      .refine(
        (val) => isStrongPassword(val, strongPasswordOptions),
        weakPasswordErrorMessage
      ),
    repeatPassword: z.string(),
  })
  .refine((values) => values.password === values.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match.",
  });

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async ({
    username,
    email,
    password,
  }: z.infer<typeof schema>) => {
    const body = JSON.stringify({ username, email, password });

    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      if (response.status === 403) {
        form.setError("root", {
          message: "This account is already registered.",
        });
      } else {
        form.setError("root", {
          message: "Unexpected error. Please try again later.",
        });
      }
      return;
    }

    toast({
      title: "Account created!",
      description: "Use your credentials again to log in.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Password" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="repeatPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Password" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          className="mt-1"
          disabled={form.formState.isSubmitting}
        >
          Register
        </Button>
      </form>
    </Form>
  );
};
export default RegisterForm;
