// Toggle inputs based on mode
document.querySelectorAll('input[name="encode_mode"]').forEach(el => {
    el.addEventListener('change', (e) => {
        ['image', 'video', 'audio', 'text'].forEach(type => {
            document.getElementById(`enc_${type}_input`).classList.add('d-none');
        });
        document.getElementById(`enc_${e.target.value}_input`).classList.remove('d-none');
    });
});

document.querySelectorAll('input[name="decode_mode"]').forEach(el => {
    el.addEventListener('change', (e) => {
        ['image', 'video', 'audio', 'text'].forEach(type => {
            document.getElementById(`dec_${type}_input`).classList.add('d-none');
        });
        document.getElementById(`dec_${e.target.value}_input`).classList.remove('d-none');
    });
});

function showToast(message, isError = false) {
    alert(message); // simpler for testing
}

// ENCODE FORM
document.getElementById('encodeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = document.querySelector('input[name="encode_mode"]:checked').value;
    const secret = document.getElementById('enc_secret').value;
    const pwd = document.getElementById('enc_pwd').value;

    if (!secret || !pwd) {
        showToast("Secret and Password are required.", true); return;
    }

    const loader = document.getElementById('enc_loader');
    loader.style.display = 'inline-block';

    try {
        if (mode === 'image') {
            const file = document.getElementById('enc_file').files[0];
            if (!file) { throw new Error("Please select an image."); }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("secret_text", secret);
            formData.append("password", pwd);

            const res = await fetch("/api/v1/image/encode", { method: 'POST', body: formData });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Image Encoding Failed");
            }

            // Handle binary stream download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stego_${file.name.replace(/\.[^/.]+$/, "")}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            document.getElementById('result-box').style.display = 'block';
            document.getElementById('enc_result_msg').innerText = "Image downloaded!";

        } else if (mode === 'video') {
            const file = document.getElementById('enc_video_file').files[0];
            if (!file) { throw new Error("Please select an MP4 or AVI video file."); }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("secret_text", secret);
            formData.append("password", pwd);

            const res = await fetch("/api/v1/video/encode", { method: 'POST', body: formData });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Video Encoding Failed");
            }

            // Handle binary stream download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stego_${file.name.replace(/\.[^/.]+$/, "")}.avi`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            document.getElementById('result-box').style.display = 'block';
            document.getElementById('enc_result_msg').innerText = "Video downloaded!";

        } else if (mode === 'audio') {
            const file = document.getElementById('enc_audio_file').files[0];
            if (!file) { throw new Error("Please select a WAV audio file."); }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("secret_text", secret);
            formData.append("password", pwd);

            const res = await fetch("/api/v1/audio/encode", { method: 'POST', body: formData });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Audio Encoding Failed");
            }

            // Handle binary stream download
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stego_${file.name.replace(/\.[^/.]+$/, "")}.wav`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            document.getElementById('result-box').style.display = 'block';
            document.getElementById('enc_result_msg').innerText = "Audio downloaded!";

        } else if (mode === 'text') {
            const coverText = document.getElementById('enc_cover_txt').value;
            if (!coverText) { throw new Error("Please insert cover text."); }

            const reqBody = { cover_text: coverText, secret_text: secret, password: pwd };

            const res = await fetch("/api/v1/text/encode", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Text Encoding Failed");
            }

            const data = await res.json();
            document.getElementById('result-box').style.display = 'block';

            // We copy the stego text directly to clipboard for the user
            await navigator.clipboard.writeText(data.stego_text);
            document.getElementById('enc_result_msg').innerText = "Text encoded and copied to clipboard successfully!";
        }
    } catch (error) {
        showToast(error.message, true);
    } finally {
        loader.style.display = 'none';
    }
});


// DECODE FORM
document.getElementById('decodeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mode = document.querySelector('input[name="decode_mode"]:checked').value;
    const pwd = document.getElementById('dec_pwd').value;

    if (!pwd) {
        showToast("Password is required.", true); return;
    }

    const loader = document.getElementById('dec_loader');
    loader.style.display = 'inline-block';
    const resultBox = document.getElementById('decode-result-box');
    resultBox.style.display = 'none';

    try {
        let res;
        if (mode === 'image') {
            const file = document.getElementById('dec_file').files[0];
            if (!file) { throw new Error("Please select an image."); }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("password", pwd);

            res = await fetch("/api/v1/image/decode", { method: 'POST', body: formData });

        } else if (mode === 'video') {
            const file = document.getElementById('dec_video_file').files[0];
            if (!file) { throw new Error("Please select an AVI video file."); }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("password", pwd);

            res = await fetch("/api/v1/video/decode", { method: 'POST', body: formData });

        } else if (mode === 'audio') {
            const file = document.getElementById('dec_audio_file').files[0];
            if (!file) { throw new Error("Please select a WAV audio file."); }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("password", pwd);

            res = await fetch("/api/v1/audio/decode", { method: 'POST', body: formData });

        } else if (mode === 'text') {
            const stegoText = document.getElementById('dec_stego_txt').value;
            if (!stegoText) { throw new Error("Please insert text string to decode."); }

            const reqBody = { stego_text: stegoText, password: pwd };

            res = await fetch("/api/v1/text/decode", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqBody)
            });
        }

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Decoding Failed");
        }

        const data = await res.json();
        resultBox.style.display = 'block';
        document.getElementById('dec_result_msg').innerText = data.secret_text;

    } catch (error) {
        showToast(error.message, true);
    } finally {
        loader.style.display = 'none';
    }
});
