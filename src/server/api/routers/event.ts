import { z } from "zod";
import { addEventInput, getEventsInput } from "../../../types";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  getEvents: publicProcedure
    .input(getEventsInput)
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.event.findMany({
          where: {
            filter: input.filter,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  getAllEvents: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.event.findMany();
    } catch (error) {
      console.log("error", error);
    }
  }),

  addEvent: protectedProcedure
    .input(addEventInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const isAdmin = await ctx.prisma.user.findFirst({
          where: {
            id: ctx.session.user.id,
            isAdmin: true,
          },
        });

        if (!isAdmin) {
          throw new Error("You are not an admin");
        }

        return await ctx.prisma.event.create({
          data: {
            name: input.name,
            date: input.date,
            attended: input.attended,
            type: input.type,
            image: input.image,
            organizer: input.organizer,
            description: input.description,
            filter: input.filter,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),

  deleteEvent: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const isAdmin = await ctx.prisma.user.findFirst({
          where: {
            id: ctx.session.user.id,
            isAdmin: true,
          },
        });

        if (!isAdmin) {
          throw new Error("You are not an admin");
        }
        
        return await ctx.prisma.event.delete({
          where: {
            id: input.id,
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
});
