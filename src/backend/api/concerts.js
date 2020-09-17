const express = require("express");
const router = express.Router();
const knex = require("../database");

/* router.get("/", async (request, response) => {
  try {
    // knex syntax for selecting things. Look up the documentation for knex for further info
    const concerts = await knex("concerts");
    response.json(concerts);
  } catch (error) {
    throw error;
  }
}); */
router.post("/", async (request, response) => {
  console.log(request);
  createConcerts({
    body: request.body,
  })
    .then((result) => response.json(result))
    .catch((error) => {
      response.status(400).send("Bad request").end();
      console.log(error);
    });
});

const createConcerts = async ({ body }) => {
  const { title, band, venue, created_date, performance_date, price } = body;
  return await knex("concerts").insert({
    title: title,
    band: band,
    venue: venue,
    created_date: created_date,
    performance_date: performance_date,
    price: price,
  });
};
const getConcertsById = async (id) => {
  try {
    return await knex("concerts").select("*").where({
      id: id,
    });
  } catch (error) {
    console.log(error);
  }
};
router.get("/:id", async (request, response) => {
  const concertsId = Number(request.params.id);
  getConcertsById(concertsId)
    .then((result) => response.json(result))
    .catch((ex) => {
      response.status(400).send("Bad request").end();
      console.log(ex);
    });
});
router.put("/:id", async (req, res) => {
  editConcerts({
    body: req.body,
    id: req.params.id,
  })
    .then((result) => res.json(result))
    .catch((error) => {
      res.status(400).send("Bad request").end();
      console.log(error);
    });
});

const editConcerts = async ({ body, id }) => {
  const { title, band, venue, created_date, performance_date, price } = body;
  const concerts = await knex.from("concerts").select("*").where({
    id: id,
  });
  if (concerts.length === 0) {
    throw new HttpError("Bad request", `Contact not found: ID ${id}!`, 404);
  }
  const queryDto = {
    price: price,
  };
  if (Object.keys(queryDto).length !== 0) {
    return await knex("concerts")
      .where({
        id: id,
      })
      .update(queryDto);
  } else return "Nothing updated!";
};

router.delete("/", async (req, res) => {
  deleteConcerts({
    body: req.body,
  })
    .then((result) => res.json(result))
    .catch((error) => {
      res.status(400).send("Bad request").end();
      console.log(error);
    });
});

const deleteConcerts = async ({ body }) => {
  try {
    if (!body.id) {
      throw new HttpError("Bad request", "Id not found", 400);
    }
    return knex("concerts")
      .where({
        id: body.id,
      })
      .del();
  } catch (err) {
    console.log(err);
    return "something went wrong, try again";
  }
};
module.exports = router;
