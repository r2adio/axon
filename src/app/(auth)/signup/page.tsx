import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth(); // prevents user to access login page, by manually changing the url

  return <RegisterForm />;
};

export default Page;
