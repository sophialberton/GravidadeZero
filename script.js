document.addEventListener('DOMContentLoaded', function() {
    const object = document.getElementById('floating-object');
    const container = document.getElementById('container');
    
    // Configurações
    const settings = {
        friction: 0.98,       // Atrito (0-1, onde 1 é sem atrito)
        bounce: 0.7,          // Elasticidade ao bater nas bordas
        floatSpeed: 0.5,      // Velocidade da flutuação natural
        floatDistance: 20,    // Distância da flutuação natural
        impulseMultiplier: 2  // Multiplicador de impulso ao soltar
    };
    
    // Estado do objeto
    let state = {
        x: container.clientWidth / 2 - object.clientWidth / 2,
        y: container.clientHeight / 2 - object.clientHeight / 2,
        vx: 0,
        vy: 0,
        isDragging: false,
        floatOffset: 0,
        lastX: 0,
        lastY: 0,
        mouseX: 0,
        mouseY: 0
    };
    
    // Posiciona o objeto inicialmente
    updatePosition();
    
    // Animação principal
    function animate() {
        if (!state.isDragging) {
            // Flutuação natural
            state.floatOffset = Math.sin(Date.now() * 0.001 * settings.floatSpeed) * settings.floatDistance;
            
            // Aplica física
            state.vx *= settings.friction;
            state.vy *= settings.friction;
            
            state.x += state.vx;
            state.y += state.vy + state.floatOffset * 0.1;
            
            // Verifica colisão com as bordas
            checkBoundaries();
        }
        
        updatePosition();
        requestAnimationFrame(animate);
    }
    
    // Atualiza a posição visual do objeto
    function updatePosition() {
        object.style.left = state.x + 'px';
        object.style.top = state.y + 'px';
    }
    
    // Verifica colisão com as bordas do container
    function checkBoundaries() {
        const containerRect = container.getBoundingClientRect();
        const objectRect = {
            left: state.x,
            top: state.y,
            right: state.x + object.clientWidth,
            bottom: state.y + object.clientHeight
        };
        
        // Borda esquerda
        if (objectRect.left < 0) {
            state.x = 0;
            state.vx = -state.vx * settings.bounce;
        }
        
        // Borda direita
        if (objectRect.right > containerRect.width) {
            state.x = containerRect.width - object.clientWidth;
            state.vx = -state.vx * settings.bounce;
        }
        
        // Borda superior
        if (objectRect.top < 0) {
            state.y = 0;
            state.vy = -state.vy * settings.bounce;
        }
        
        // Borda inferior
        if (objectRect.bottom > containerRect.height) {
            state.y = containerRect.height - object.clientHeight;
            state.vy = -state.vy * settings.bounce;
        }
    }
    
    // Eventos de mouse
    object.addEventListener('mousedown', function(e) {
        state.isDragging = true;
        state.lastX = e.clientX;
        state.lastY = e.clientY;
        state.vx = 0;
        state.vy = 0;
    });
    
    document.addEventListener('mousemove', function(e) {
        if (state.isDragging) {
            const dx = e.clientX - state.lastX;
            const dy = e.clientY - state.lastY;
            
            state.x += dx;
            state.y += dy;
            
            state.lastX = e.clientX;
            state.lastY = e.clientY;
            
            // Armazena a velocidade para o impulso
            state.vx = dx;
            state.vy = dy;
            
            updatePosition();
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (state.isDragging) {
            state.isDragging = false;
            
            // Aplica impulso ao soltar
            state.vx *= settings.impulseMultiplier;
            state.vy *= settings.impulseMultiplier;
        }
    });
    
    // Inicia a animação
    animate();
});