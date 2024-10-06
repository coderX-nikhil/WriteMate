
    const canvas = document.getElementById('cursorTrail');
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let mouseMoved = false;
        const pointer = {
            x: 0.5 * width,
            y: 0.5 * height
        };
        const params = {
            pointsNumber: 30, // Reduced the number of points for a shorter trail
            widthFactor: 0.3,
            spring: 0.2, // Adjusted spring for smoother movements
            friction: 0.6, // Increased friction to slow down the tail
            velocity: 0.4,
            dampening: 0.1,
            tension: 0.98
        };

        const trail = new Array(params.pointsNumber);
        for (let i = 0; i < params.pointsNumber; i++) {
            trail[i] = {
                x: pointer.x,
                y: pointer.y,
                dx: 0,
                dy: 0
            }
        }

        window.addEventListener("mousemove", e => {
            mouseMoved = true;
            updateMousePosition(e.pageX, e.pageY);
        });

        window.addEventListener("touchmove", e => {
            mouseMoved = true;
            updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        });

        function updateMousePosition(eX, eY) {
            pointer.x = eX;
            pointer.y = eY;
        }

        setupCanvas();
        update(0);
        window.addEventListener("resize", setupCanvas);

        function setupCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function update(t) {
            if (!mouseMoved) {
                pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * width;
                pointer.y = (0.5 + 0.2 * Math.sin(0.005 * t) + 0.1 * Math.cos(0.01 * t)) * height;
            }

            ctx.clearRect(0, 0, width, height);

            trail.forEach((p, pIdx) => {
                const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
                const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
                p.dx += (prev.x - p.x) * spring;
                p.dy += (prev.y - p.y) * spring;
                p.dx *= params.friction;
                p.dy *= params.friction;
                p.x += p.dx;
                p.y += p.dy;
            });

            ctx.beginPath();
            ctx.moveTo(trail[0].x, trail[0].y);

            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, "rgba(255, 0, 255, 0.8)");
            gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.8)");
            gradient.addColorStop(1, "rgba(255, 255, 0, 0.8)");

            for (let i = 1; i < params.pointsNumber - 1; i++) {
                const xc = 0.5 * (trail[i].x + trail[i + 1].x);
                const yc = 0.5 * (trail[i].y + trail[i + 1].y);
                ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            }

            ctx.strokeStyle = gradient;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = params.widthFactor * 20;
            ctx.stroke();

            // Add glow effect
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.shadowBlur = 20;
            ctx.stroke();
            
            window.requestAnimationFrame(update);
        }
