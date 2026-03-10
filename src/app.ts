import fastify from "fastify";
import { register } from "@/http/controllers/register";
import { appRoutes } from "./http/routes";
import { request } from "http";
import z from "zod";

export const app = fastify()



app.register( appRoutes )

