document.addEventListener('DOMContentLoaded', function() {
    const questionForm = document.getElementById('add-question-form');
    const questionTextInput = document.getElementById('question-text');
    const deepnessLevelInput = document.getElementById('deepness-level');
    const questionCountSpan = document.getElementById('question-count');
    const pickQuestionButton = document.getElementById('pick-question-button');
    const questionCardDiv = document.getElementById('question-card');
    const levelButtons = document.querySelectorAll('.level-button');
    const levelErrorMessage = document.getElementById('level-error-message');

    // Map level numbers to level names
    const levelNames = {
        1: 'Would You Rather?',
        2: 'About Each Other',
        3: 'Personal',
        4: 'Deep',
        5: 'Deep as Fuck'
    };

    // Load existing questions from localStorage
    let questions = JSON.parse(localStorage.getItem('questions')) || [];

    updateQuestionCount();

    let currentQuestionIndex = null; // To keep track of the displayed question

    // Handle level button clicks
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all buttons
            levelButtons.forEach(btn => btn.classList.remove('selected'));
            // Add 'selected' class to clicked button
            this.classList.add('selected');
            // Update hidden input value
            deepnessLevelInput.value = this.getAttribute('data-level');
            // Hide error message if visible
            levelErrorMessage.textContent = '';
        });
    });

    questionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const questionText = questionTextInput.value.trim();
        const deepnessLevel = parseInt(deepnessLevelInput.value);

        // Reset error message
        levelErrorMessage.textContent = '';

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
            console.log('Question added successfully!');
            // Scroll to the top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (!deepnessLevel || isNaN(deepnessLevel)) {
                levelErrorMessage.textContent = 'Please select a deepness level.';
            }
            console.log('Please enter a valid question and select a deepness level.');
        }
    });

    pickQuestionButton.addEventListener('click', function() {
        if (questions.length === 0) {
            alert('No questions saved!');
            return;
        }

        if (currentQuestionIndex !== null) {
            // A question is already displayed, remove it
            removeCurrentQuestion();
        }

        if (questions.length === 0) {
            // After removing the current question, there may be no questions left
            console.log('No more questions left!');
            questionCardDiv.style.display = 'none';
            return;
        }

        // Pick a random question
        currentQuestionIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[currentQuestionIndex];

        // Display the question in the question-card div
        questionCardDiv.innerHTML = `
            <h3>${randomQuestion.text}</h3>
            <p>${levelNames[randomQuestion.level]}</p>
        `;
        questionCardDiv.className = '';
        questionCardDiv.classList.add(`level-${randomQuestion.level}`);
        questionCardDiv.style.display = 'block';

        // Scroll to the question card
        questionCardDiv.scrollIntoView({ behavior: 'smooth' });

        // Add event listener to the done button
        document.getElementById('done-button').addEventListener('click', function() {
            removeCurrentQuestion();
            questionCardDiv.style.display = 'none';
        });
    });

    function removeCurrentQuestion() {
        if (currentQuestionIndex !== null) {
            // Remove the question from the array
            questions.splice(currentQuestionIndex, 1);
            // Update localStorage
            localStorage.setItem('questions', JSON.stringify(questions));
            // Reset currentQuestionIndex
            currentQuestionIndex = null;
            // Update question count
            updateQuestionCount();
            console.log('Question removed from the list.');
        }
    }

    function updateQuestionCount() {
        questionCountSpan.textContent = questions.length;
    }

});
