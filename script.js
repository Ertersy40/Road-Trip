document.addEventListener('DOMContentLoaded', function() {
    const questionForm = document.getElementById('add-question-form');
    const questionTextInput = document.getElementById('question-text');
    const deepnessLevelInput = document.getElementById('deepness-level');
    const questionCountSpan = document.getElementById('question-count');
    const pickQuestionButton = document.getElementById('pick-question-button');
    const questionCardDiv = document.getElementById('question-card');
    const levelButtons = document.querySelectorAll('.level-button');

    // Map level numbers to level names
    const levelNames = {
        1: 'Icebreaker',
        2: 'Casual',
        3: 'Thoughtful',
        4: 'Deep',
        5: 'Soulful'
    };

    // Load existing questions from localStorage
    let questions = JSON.parse(localStorage.getItem('questions')) || [];

    updateQuestionCount();

    // Handle level button clicks
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all buttons
            levelButtons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to clicked button
            this.classList.add('selected');
            // Update hidden input value
            deepnessLevelInput.value = this.getAttribute('data-level');
        });
    });

    questionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const questionText = questionTextInput.value.trim();
        const deepnessLevel = parseInt(deepnessLevelInput.value);

        if (questionText && deepnessLevel >=1 && deepnessLevel <=5) {
            // Create question object
            const question = {
                text: questionText,
                level: deepnessLevel
            };
            // Add to questions array
            questions.push(question);
            // Save to localStorage
            localStorage.setItem('questions', JSON.stringify(questions));
            // Clear input fields
            questionTextInput.value = '';
            deepnessLevelInput.value = '';
            // Remove selection from level buttons
            levelButtons.forEach(btn => btn.classList.remove('selected'));
            // Update question count
            updateQuestionCount();
            // Provide feedback to the user
            alert('Question added successfully!');
            // Scroll to the top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            alert('Please enter a valid question and select a deepness level.');
        }
    });

    pickQuestionButton.addEventListener('click', function() {
        if (questions.length === 0) {
            alert('No questions saved!');
            return;
        }
        // Pick a random question
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];

        // Display the question in the question-card div
        questionCardDiv.innerHTML = `<h3>${levelNames[randomQuestion.level]}</h3><p>${randomQuestion.text}</p>`;
        questionCardDiv.className = '';
        questionCardDiv.classList.add(`level-${randomQuestion.level}`);
        questionCardDiv.style.display = 'block';

        // Scroll to the question card
        questionCardDiv.scrollIntoView({ behavior: 'smooth' });
    });

    function updateQuestionCount() {
        questionCountSpan.textContent = questions.length;
    }

});