import connectDB from "@/libs/mongodb";
import Post from "@/models/post.models";
import { NextResponse } from "next/server";

// GET - Récupérer tous les posts
export async function GET() {
  try {
    await connectDB();
    const posts = await Post.find();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// POST - Créer un nouveau post
export async function POST(request) {
  try {
    await connectDB();
    const { title, content } = await request.json();
    // Vérification des champs requis
    if (!title || !content) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }
    // Création du nouveau post
    const newPost = await Post.create({
      title,
      content,
    });
    return NextResponse.json(
      { message: "Post créé avec succès", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// PUT - Mettre à jour un post
export async function PUT(request) {
  try {
    await connectDB();
    const { id } = request.query;
    const { title, content } = await request.json();
    // Vérification des champs requis
    if (!title || !content) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }
    // Mise à jour du post
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    return NextResponse.json(
      { message: "Post mis à jour avec succès", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un post
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = request.query;
    // Suppression du post
    await Post.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Post supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}