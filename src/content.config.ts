import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      pubDate: z.date(),
      author: z.string(),
      description: z.string(),
      image: z.object({
        src: z.string(),
        alt: z.string(),
      }),
      tags: z.array(z.string()),
      id: z.number(),
      category: z.enum(["article", "plante"]),
      // Champs spécifiques aux plantes (optionnels)
      name: z
        .object({
          scientificName: z.string(),
          commonName: z.string(),
        })
        .optional(),
    })
    // Validation conditionnelle : si category = 'plante', alors name est requis
    .refine(
      (data) => {
        if (data.category === "plante") {
          return data.name !== undefined;
        }
        return true;
      },
      {
        message:
          "Le champ 'name' est requis pour les articles de type 'plante'",
      }
    ),
});

export const collections = {
  blog: blogCollection,
};
