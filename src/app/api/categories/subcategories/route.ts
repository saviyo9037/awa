import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const subcatFilePath = path.join(process.cwd(), "src", "data", "subcategories.json");

function getSubcategoriesData() {
  try {
    if (fs.existsSync(subcatFilePath)) {
      const content = fs.readFileSync(subcatFilePath, "utf8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading subcategories:", err);
  }
  return {
    image: [],
    video: [],
    website: [],
    slides: [],
  };
}

function saveSubcategoriesData(data: Record<string, any[]>) {
  try {
    const dir = path.dirname(subcatFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(subcatFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error saving subcategories:", err);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const data = getSubcategoriesData();

    if (category && data[category]) {
      return NextResponse.json({
        success: true,
        category,
        data: data[category],
      });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch subcategories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, name, slug } = body;

    if (!categoryId || !name) {
      return NextResponse.json(
        { success: false, error: "Category ID and subcategory name are required" },
        { status: 400 }
      );
    }

    const effectiveCat = categoryId.toLowerCase().trim();
    const data = getSubcategoriesData();

    if (!data[effectiveCat]) {
      data[effectiveCat] = [];
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const id = generatedSlug || `sub-${Date.now()}`;

    // Check if duplicate
    const existingIndex = data[effectiveCat].findIndex(
      (s: any) => s.id === id || s.slug === generatedSlug || s.name.toLowerCase() === name.toLowerCase()
    );

    if (existingIndex >= 0) {
      return NextResponse.json({
        success: true,
        message: "Subcategory already exists",
        data: data[effectiveCat][existingIndex],
      });
    }

    const newSub = {
      id,
      name: name.trim(),
      slug: generatedSlug,
    };

    data[effectiveCat].push(newSub);
    saveSubcategoriesData(data);

    return NextResponse.json({
      success: true,
      message: "Subcategory added successfully",
      data: newSub,
      all: data[effectiveCat],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save subcategory" },
      { status: 500 }
    );
  }
}
