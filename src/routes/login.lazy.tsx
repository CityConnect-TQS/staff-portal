import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NavbarStaff } from "@/components/navbar.tsx";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { loginUser } from "@/services/userService.ts";
import { MaterialSymbol } from "react-material-symbols";
import { Button, Chip, CircularProgress, Input } from "@nextui-org/react";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [cookies, setCookies] = useCookies(["user"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.user !== undefined) {
      void navigate({ to: "/" });
    }
  }, [cookies.user, navigate]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      setCookies("user", JSON.stringify(user), {
        path: "/",
        expires: new Date(user.expires),
      });
      void navigate({ to: "/" });
    },
  });

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator,
    validators: {
      onSubmit: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least six characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <NavbarStaff />
      <div className="p-8 lg:p-24 flex flex-col items-center justify-center gap-16">
        <h1 className="font-bold text-3xl lg:text-5xl text-center text-balance">
          Hi there!
        </h1>

        <form className={"w-96 flex flex-col gap-2 items-center"}>
          <Field
            name="email"
            validatorAdapter={zodValidator}
            validators={{
              onChange: z.string().email("Invalid email address"),
            }}
          >
            {({ state, handleChange, handleBlur }) => (
              <Input
                onChange={(e) => handleChange(e.target.value)}
                endContent={<MaterialSymbol icon="email" size={20} />}
                label="Email"
                id={"email"}
                onBlur={handleBlur}
                placeholder="Enter your email"
                isInvalid={state.meta.errors.length > 0}
                errorMessage={state.meta.errors}
              />
            )}
          </Field>
          <Field
            name="password"
            validatorAdapter={zodValidator}
            validators={{
              onChange: z
                .string()
                .min(6, "Password must be at least six characters"),
            }}
          >
            {({ state, handleChange, handleBlur }) => (
              <Input
                onChange={(e) => handleChange(e.target.value)}
                endContent={<MaterialSymbol icon="password" size={20} />}
                label="Password"
                id={"password"}
                onBlur={handleBlur}
                placeholder="Enter your password"
                type="password"
                isInvalid={state.meta.errors.length > 0}
                errorMessage={state.meta.errors}
              />
            )}
          </Field>
          <Subscribe>
            {({ canSubmit, isSubmitting }) => (
              <Button
                color={isSubmitting ? "default" : "primary"}
                variant={isSubmitting ? "flat" : "solid"}
                isDisabled={!canSubmit}
                id={"loginBtn"}
                onPress={() => {
                  handleSubmit().catch(() => {
                    console.log("Error", "Failed to log in");
                  });
                }}
              >
                {isSubmitting ? (
                  <CircularProgress
                    size={"sm"}
                    strokeWidth={3}
                    color={"primary"}
                    aria-label="Loading..."
                  />
                ) : (
                  "Login"
                )}
              </Button>
            )}
          </Subscribe>
          {mutation.isError && (
            <Chip
              color="danger"
              variant={"flat"}
              id={"loginError"}
              startContent={<MaterialSymbol icon="error" size={20} />}
              className={"mt-4"}
            >
              {mutation.error.message}
            </Chip>
          )}
        </form>
      </div>
    </div>
  );
}
