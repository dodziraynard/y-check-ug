package com.hrd.ycheck.utils

import com.hrd.ycheck.models.Option
import com.hrd.ycheck.models.Question
import com.hrd.ycheck.models.QuestionType

object DataUtils {
    fun getDummyQuestions(): List<Question> {
        val questions = mutableListOf<Question>()

//        questions.add(
//            Question(
//                1,
//                "With whom do you live?",
//                QuestionType.TEXT_INPUT,
//                "I live with ...",
//                options = null,
//                imageUrl = "https://sample-videos.com/img/Sample-png-image-100kb.png"
//            )
//        )
//
//        questions.add(
//            Question(
//                1,
//                "What's your gender",
//                QuestionType.NUMBER_FIELD,
//                "I am a ...",
//                options = listOf(Option(1, "Boy"), Option(1, "Girl")),
//                imageUrl = "https://sample-videos.com/img/Sample-png-image-100kb.png"
//            )
//        )
//
//
//        questions.add(
//            Question(
//                1,
//                "Choose your favourites",
//                QuestionType.CHECKBOXES,
//                "I like ...",
//                options = listOf(
//                    Option(1, "Football ⚽️"),
//                    Option(1, "Ampe 🙃😈🎡😈"),
//                    Option(1, "Chess ♛♛"),
//                    Option(1, "Subway Surf 🌊🏄🏾‍♂️🏄🏾‍ ")
//                ),
//                imageUrl = "https://sample-videos.com/img/Sample-png-image-100kb.png"
//            )
//        )
//
//        // Question without picture
//        questions.add(
//            Question(
//                1,
//                "Choose your favourites",
//                QuestionType.CHECKBOXES,
//                "I like ...",
//                options = listOf(
//                    Option(1, "Football"),
//                    Option(1, "Ampe"),
//                    Option(1, "Chess"),
//                    Option(1, "Subway Surf")
//                ),
//            )
//        )
        return questions
    }
}