import BackButton from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicket } from "@/lib/queries/getTicket";
import * as Sentry from "@sentry/nextjs";
import TicketForm from "@/app/(rs)/tickets/form/TicketForm";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Users, init as kindeInit } from "@kinde/management-api-js";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId)
    return {
      title: "Missing Customer ID or Ticket ID",
    };
  if (customerId) return { title: `New Ticket for Customer # ${customerId}` };

  return { title: `Edit Ticket # ${ticketId}` };
}

export default async function TicketFormPage({ searchParams }: Props) {
  try {
    const { customerId, ticketId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className="mb-2 text-2xl">
            Ticket ID or Customer ID required to load ticket form.
          </h2>
          <BackButton title="Go back" variant="default" />
        </>
      );
    }

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission("manager"),
      getUser(),
    ]);
    const isManager = managerPermission?.isGranted;

    // New ticket form
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

      if (!customer.active) {
        return (
          <>
            <h2 className="mb-2 text-2xl">
              Customer ID #{customerId} is not active.
            </h2>
            <BackButton title="Go back" variant="default" />
          </>
        );
      }
      // return ticket form
      if (isManager) {
        kindeInit(); // Initializes the Kinde Management API
        const { users } = await Users.getUsers();
        const techs =
          users?.map((user) => ({
            id: user.email?.toLowerCase() || "",
            description: user.email?.toLowerCase() || "",
          })) ?? [];
        return (
          <TicketForm customer={customer} techs={techs} isManager={isManager} />
        );
      } else {
        return <TicketForm customer={customer} />;
      }
    }

    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        return (
          <>
            <h2 className="mb-2 text-2xl">Ticket ID #{ticketId} not found.</h2>
            <BackButton title="Go back" variant="default" />
          </>
        );
      }

      const customer = await getCustomer(ticket.customerId);

      // return ticket form
      if (isManager) {
        kindeInit();
        const { users } = await Users.getUsers();
        const techs = users
          ? users.map((user) => ({
              id: user.email!.toLowerCase(),
              description: user.email!.toLowerCase(),
            }))
          : [];
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            techs={techs}
            isManager={isManager}
          />
        );
      } else {
        const isEditable =
          user.email?.toLowerCase() === ticket.tech.toLowerCase();
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}
