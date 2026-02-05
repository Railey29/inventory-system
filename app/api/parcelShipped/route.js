import { NextResponse } from "next/server";
import {
  addParcelInItem,
  getParcelInItems,
  deleteParcelInItem,
  updateParcelInItem,
} from "../../controller/parcelShipped";

// GET: fetch all items
export async function GET(req) {
  const { data, error } = await getParcelInItems();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 200 });
}

// POST: add new item
export async function POST(req) {
  try {
    const body = await req.json(); // expects { item_name, date, quantity, time_in }
    const { data, error } = await addParcelInItem(body);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// PUT: update item
export async function PUT(req) {
  try {
    const body = await req.json(); // expects { id, updates: { item_name?, date?, quantity?, time_in? } }
    const { id, updates } = body;

    const { data, error } = await updateParcelInItem(id, updates);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// DELETE: delete item
export async function DELETE(req) {
  try {
    const body = await req.json(); // expects { id }
    const { id } = body;

    const { data, error } = await deleteParcelInItem(id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(
      { message: "Item deleted", data },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
