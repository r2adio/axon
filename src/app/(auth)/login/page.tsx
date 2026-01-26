import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth(); // prevents user to access login page, by manually changing the url

  return <LoginForm />;
};

export default Page;
