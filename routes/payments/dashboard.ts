import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

const stripe = require("stripe")(
  "sk_test_51KqHnWBPMHj98s1MnAX7sZJ6CfY8VvroBEd1MwCD3yGCdUcvFT4IGq3sBP8TT7iXPI41LXO00AvkuBENuyFbaJQe00V74iJtSk"
);

router.post("/:accountId", async (req: Request, res: Response) => {
  const accountId = req.params.accountId;

  const link = await stripe.accounts.createLoginLink(accountId);

  res.send(link.url);
});

module.exports = router;
