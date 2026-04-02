import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const condition = searchParams.get("condition");
    const min_price = searchParams.get("min_price");
    const max_price = searchParams.get("max_price");
    const min_year = searchParams.get("min_year");
    const max_year = searchParams.get("max_year");
    const min_hours = searchParams.get("min_hours");
    const max_hours = searchParams.get("max_hours");
    const min_hp = searchParams.get("min_hp");
    const max_hp = searchParams.get("max_hp");
    const transmission = searchParams.get("transmission");
    const state = searchParams.get("state");
    const sort = searchParams.get("sort") || "newest";
    const status = searchParams.get("status") || "active";
    const seller_id = searchParams.get("seller_id");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (condition) query.condition = condition;
    if (seller_id) query.seller_id = seller_id;
    if (transmission) query.transmission = transmission;
    if (state) query["location.state"] = state;
    if (featured === "true") query.featured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseFloat(min_price);
      if (max_price) query.price.$lte = parseFloat(max_price);
    }

    if (min_year || max_year) {
      query.year = {};
      if (min_year) query.year.$gte = parseInt(min_year);
      if (max_year) query.year.$lte = parseInt(max_year);
    }

    if (min_hours || max_hours) {
      query.hours = {};
      if (min_hours) query.hours.$gte = parseInt(min_hours);
      if (max_hours) query.hours.$lte = parseInt(max_hours);
    }

    if (min_hp || max_hp) {
      query.horsepower = {};
      if (min_hp) query.horsepower.$gte = parseInt(min_hp);
      if (max_hp) query.horsepower.$lte = parseInt(max_hp);
    }

    let sortObj: any = {};
    switch (sort) {
      case "price_asc":
        sortObj = { price: 1 };
        break;
      case "price_desc":
        sortObj = { price: -1 };
        break;
      case "oldest":
        sortObj = { created_at: 1 };
        break;
      case "year_desc":
        sortObj = { year: -1 };
        break;
      case "year_asc":
        sortObj = { year: 1 };
        break;
      case "hours_asc":
        sortObj = { hours: 1 };
        break;
      case "hours_desc":
        sortObj = { hours: -1 };
        break;
      case "newest":
      default:
        sortObj = { created_at: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const total = await db.collection("listings").countDocuments(query);
    const listings = await db
      .collection("listings")
      .find(query, { projection: { _id: 0 } })
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      listings,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

