// src/components/NewPostForm.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import "./AddPost.css"
const NewPostForm = () => {
    const [content, setContent] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const accessToken = useSelector(state => state.auth.accessToken);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content) {
            setStatusMessage('Le contenu de la publication ne peut pas être vide.');
            return;
        }

        try {
            // Appel à l’API Facebook pour créer un nouveau post
            window.FB.api(
                '/me/feed',
                'POST',
                { message: content, access_token: accessToken },
                (response) => {
                    if (response && !response.error) {
                        setStatusMessage('Publication réussie !');
                        setContent(''); // Réinitialise le champ de contenu
                    } else {
                        setStatusMessage('Échec de la publication. Veuillez réessayer.');
                        console.error('Erreur lors de la publication:', response.error);
                    }
                }
            );
        } catch (error) {
            console.error('Erreur lors de la tentative de publication :', error);
            setStatusMessage('Erreur de réseau. Veuillez réessayer.');
        }
    };

    return (
        <div className="new-post-form">
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Quoi de neuf ?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="4"
                    required
                />
                <button type="submit">Publier</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default NewPostForm;
