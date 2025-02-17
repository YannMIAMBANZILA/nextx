import { connect } from '../../../libs/mongodb';
import User from '../../../models/user.models';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// GET - Récupérer tous les utilisateurs
export async function GET() {
    try {
        await connect();
        const users = await User.find().select('-password'); // Exclure le mot de passe
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
// POST - Créer un nouvel utilisateur
export async function POST(request) {
    try {
        await connect();
        const { username, email, password } = await request.json();

        // Vérification des champs requis
        if (!username || !email || !password) {
            return NextResponse.json({ 
                error: "Tous les champs sont obligatoires" 
            }, { status: 400 });
        }
 // Vérification si l'utilisateur existe déjà
 const existingUser = await User.findOne({ 
    $or: [{ email }, { username }] 
});

if (existingUser) {
    return NextResponse.json({ 
        error: "L'email ou le nom d'utilisateur existe déjà" 
    }, { status: 400 });
}

// Hashage du mot de passe
const hashedPassword = await bcrypt.hash(password, 10);

// Création du nouvel utilisateur
const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
});

// Retourner l'utilisateur sans le mot de passe
const userResponse = {
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt
};
return NextResponse.json({ 
    message: "Utilisateur créé avec succès",
    user: userResponse 
}, { status: 201 });

} catch (error) {
console.error("Erreur création utilisateur:", error);
return NextResponse.json({ error: error.message }, { status: 500 });
}
}
// PUT - Mettre à jour un utilisateur
export async function PUT(request) {
    try {
        await connect();
        const { id, ...updateData } = await request.json();

        // Si le mot de passe est mis à jour, le hasher
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request) {
    try {
        await connect();
        const { id } = await request.json();

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json(
                { error: "Utilisateur non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Utilisateur supprimé avec succès" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
