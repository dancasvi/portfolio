$(document).ready(function () {
    const icons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐸'];
    let cards = icons.concat(icons).sort(() => 0.5 - Math.random());

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let timerInterval = null;
    let seconds = 0;
    let timerStarted = false;

    // Atualiza contador
    function updateMoves() {
        moves++;
        $('#moves').text(moves);
    }

    // Timer
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            $('#timer').text(`${min}:${sec}`);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Embaralhar e criar cartas
    cards.forEach(icon => {
        const cardHtml = `
            <div class="card-container">
                <div class="card" data-icon="${icon}">
                    <div class="front"></div>
                    <div class="back">${icon}</div>
                </div>
            </div>`;
        $('#game-board').append(cardHtml);
    });

    // Clique em carta
    $('.card').on('click', function () {
        if (lockBoard || $(this).hasClass('matched') || $(this).hasClass('flipped')) return;

        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }

        $(this).addClass('flipped');

        if (!firstCard) {
            firstCard = $(this);
        } else {
            secondCard = $(this);
            lockBoard = true;
            updateMoves();

            if (firstCard.data('icon') === secondCard.data('icon')) {
                firstCard.addClass('matched');
                secondCard.addClass('matched');
                matchedPairs++;
                resetSelection();
                checkVictory();
            } else {
                setTimeout(() => {
                    firstCard.removeClass('flipped');
                    secondCard.removeClass('flipped');
                    resetSelection();
                }, 1000);
            }
        }
    });

    function resetSelection() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function checkVictory() {
        if (matchedPairs === 10) {
            stopTimer();
            $('#final-time').text($('#timer').text());
            $('#final-moves').text(moves);
            $('#victory-screen').removeClass('d-none');
        }
    }

    $('#restart-btn').on('click', function () {
        location.reload();
    });

    // Drag no mobile
    let isDragging = false;
    let startX, startY;
    let scrollLeft = 0, scrollTop = 0;
    const board = $('#game-board')[0];

    $('#game-board').on('mousedown touchstart', function (e) {
        isDragging = true;
        startX = e.pageX || e.originalEvent.touches[0].pageX;
        startY = e.pageY || e.originalEvent.touches[0].pageY;
        scrollLeft = board.scrollLeft;
        scrollTop = board.scrollTop;
    });

    $('#game-board').on('mousemove touchmove', function (e) {
        if (!isDragging) return;
        let x = e.pageX || e.originalEvent.touches[0].pageX;
        let y = e.pageY || e.originalEvent.touches[0].pageY;
        board.scrollLeft = scrollLeft - (x - startX);
        board.scrollTop = scrollTop - (y - startY);
    });

    $(document).on('mouseup touchend', function () {
        isDragging = false;
    });
});
