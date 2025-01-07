import { db } from "@/db";
import { tickets, customers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getOpenTickets() {
  return db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      title: tickets.title,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      tech: tickets.tech,
      completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(eq(tickets.completed, false))
    .orderBy(asc(tickets.createdAt));
}
