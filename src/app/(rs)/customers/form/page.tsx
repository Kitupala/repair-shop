import BackButton from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import * as Sentry from "@sentry/nextjs";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { customerId } = await searchParams;

  if (!customerId) {
    return { title: "New Customer" };
  }
  return { title: `Edit Customer ${customerId}` };
}

export default async function CustomerFormPage({ searchParams }: Props) {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

    const { customerId } = await searchParams;

    // Edit customer form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className="mb-2 text-2xl">
              Customer ID #{customerId} not found.
            </h2>
            <BackButton title="Go back" variant="default" />
          </>
        );
      }

      return <CustomerForm isManager={isManager} customer={customer} />;
    } else {
      return <CustomerForm isManager={isManager} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
