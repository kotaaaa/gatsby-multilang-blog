---
title: 'What I learned about Naive Bayes'
date: '2019-05-28 17:40:32'
description: Naive Bayes, Algorizm, Python, Machine Learning
category: Python
background: '#4169e1'
---

Given a document $d$, this is a machine learning algorithm that determines which class $d$ is classified by using the frequency of words appearing in the document.
By using this algorithm, we can
For a new document

-   If the word "Ichiro" or "hit" appears frequently in the document, it is classified as baseball.
-   If a document contains many words such as "Keisuke Honda" or "shoot", it is classified into the football category.

If the words "Keisuke Honda" and "shoot" appear a lot in the document, it will be classified as football.
Is it really possible to do such a thing?

The important points are

-   Maximum likelihood estimation
-   Maximum a posteriori probability estimation (MAP estimation)

The two most important points are
First, let's look at these two points with some examples.

### First, what is maximum likelihood estimation?

Maximum Likelihood Estimation means

Maximum likelihood estimation is the estimation of the probability $θ$ of an event occurring that is most likely to occur from the obtained data.
I will explain it with a concrete example.

> Here is a coin.
> When you toss this coin, it comes up face up 7 times out of 10.
> Now, what is the probability θ that this coin will come up?

Maximum likelihood estimation is to find the value of $θ$ in this case.

In general, you would think that $θ=1/2$, but in this situation, this is not necessarily the case.

For simplicity's sake, let's assume $n=4$ and perform maximum likelihood estimation.
In the table, $θ$ is the probability of getting a front.

| θ    | Front | Back | Front | Front | likelihood |
| ---- | ----- | ---- | ----- | ----- | ---------- |
| 0.0  | 0     | 1    | 0     | 0     | 0          |
| 0.1  | 0.1   | 0.9  | 0.1   | 0.1   | 0.0009     |
| 0.2  | 0.2   | 0.8  | 0.2   | 0.2   | 0.0064     |
| 0.3  | ...   | ...  | ...   | ...   | ...        |
| 0.4  | ...   | ...  | ...   | ...   | ...        |
| 0.5  | 0.5   | 0.5  | 0.5   | 0.5   | 0.0625     |
| 0.6  | 0.6   | 0.4  | 0.6   | 0.6   | 0.0864     |
| 0.75 | 0.75  | 0.25 | 0.75  | 0.25  | **0.1054** |
| 0.8  | 0.8   | 0.2  | 0.8   | 0.8   | 0.1024     |
| ...  | ...   | ...  | ...   | ...   | ...        |
| 1    | 1     | 0    | 1     | 1     | 0          |

The likelihood is the probability that the event that just happened could have happened at a given $θ$.
That is

$$
likelihood=P(front)P(back)P(front)P(front)
$$

is obtained by The distribution of this likelihood according to each value of $θ$ is called a probability distribution.

In this example, when $θ = 0.75, 0.1054$ seems to be the $θ$ with the highest likelihood (probability of getting a front).

The implication of this result is that

> If there are two sides to a coin, the probability of getting a face is 0.1054.
> If you don't know that the probability of a coin coming out face up or face down is 1/2, and you toss the coin in front of you 4 times and it comes out face up 3 times, you will probably conclude that the probability of this coin coming out face up is 0.75.

This is what I mean.

In fact, this can be obtained by differentiating the probability.

$$
P(front|θ) = θ^3(1-θ)
$$

<!-- 数式例 -->
<!-- $$
\tag{1} a^2 + b^2 = c^2
$$ -->

$$
\frac{d}{dθ} = \frac{d}{dθ}P(front|θ) = \frac{d}{dθ}θ^3 (1-θ)
$$

$$
=3θ^2 - 4θ^3
$$

$$
=0
$$

Solve this equation,

$$
θ=0,3/4
$$

and we get this idea of finding the most plausible value of θ can be used to apply Naive Bayes.

### Let's try simple naive Bayes.

I will explain the maximum posterior probability in the second half.
Here is a simple naive Bayes problem.

Here are three articles on baseball and football, respectively.
In naive Bayes, we assume that each article consists of only words.

-   three baseball articles

$$
d^{(1)} = "hit", "pitcher", "hit", "hit"
$$

$$
d^{(2)} = "hit", "home run", "pitcher", "shot"
$$

$$
d^{(3)} = "Pitcher", "Pass", "Hit", "Home run"
$$

-   Three football articles.

$$
d^{(4)} ="Pass", "Shoot", "Hit", "Pass"
$$

$$
d^{(5)} ="Pass", "Home run", "Dribble", "Shoot"\\
$$

$$
d^{(6)} ="Throw", "Pass", "Shoot", "Dribble", "Shoot"
$$

-   Suppose we want to predict whether the following document $d$ belongs to football or baseball.

$$
d^{(7)} = "hit", "home run", "pitcher", "hit"
$$

$$
d^{(8)} = "pass", "shoot", "hit", "home run"
$$

$d(7)$ has a lot of baseball words, so I hope it gets classified in the baseball category!
$d(8)$ has two words in it, one that looks like football and one that looks like baseball.　 In $d(8)$, there are two words that look like football and two words that look like baseball. Which category will it fall into?

### Learn the statistics of the model

Class name

$$
c={"baseball", "football"}
$$

Word name

$$
w={"Hit", "Home run", "Pitcher", "Shoot", "Pass", "Dribble"}
$$

Let's summarize the frequency of words in the document in front.

|                         | word name w | "hit" | "home run" | "pitcher" | "shoot" | "pass" | "dribble" | total |
| ----------------------- | ----------- | ----- | ---------- | --------- | ------- | ------ | --------- | ----- |
| frequency of occurrence | baseball    | 4     | 2          | 3         | 1       | 1      | 1         | 12    |
|                         | football    | 1     | 1          | 1         | 4       | 4      | 2         | 13    |

Next, we calculate the probability P(w|c) of each word appearing in each class c.
This is called the prior probability, and is expressed using conditional probability.
It refers to the percentage of each word in each category (in this case baseball and football).

For more information on conditional probability and prior probability, please refer to
Conditional probability and prior probability are discussed in this article.

-   [Conditional probability](https://mathtrain.jp/jyokentsuki)
-   [Prior distribution](https://ja.wikipedia.org/wiki/%E4%BA%8B%E5%89%8D%E7%A2%BA%E7%8E%87)

|                 | word name w | "hit" | "home run" | "pitcher" | "shoot" | "pass" | "dribble" | total |
| --------------- | ----------- | ----- | ---------- | --------- | ------- | ------ | --------- | ----- |
| probability $p$ | baseball    | 4/12  | 2/12       | 3/12      | 1/12    | 1/12   | 1/12      | 1     |
|                 | football    | 1/13  | 1/13       | 1/13      | 4/13    | 4/13   | 2/13      | 1     |

It turns out that words related to baseball actually have a higher prior probability in the baseball category!
(The same can be said for football.)

Let's use the model to identify documents!

Now, let's see which class $d(7)$ and $d(8)$ fall into, respectively, using the model consisting of the statistical prior probabilities we created here!

### Classify baseball articles.

If we assume that $d(7)$ is the baseball category, then

$$
P(c=baseball|d(7))
$$

$$
= P("hit"|"baseball") * P("home run"|"baseball") * P("pitcher"|"baseball") * P("hit"|"baseball")
$$

$$
= 4/12 * 2/12 * 3/12 * 4/12
$$

$$
= 1/216
$$

$$
= 0.00463
$$

If we assume that $d(7)$ is the category of football, then

$$
P(c=football|d(7))
$$

$$
= P("hit"|"football") * P("home run"|"football") * P("pitcher"|"football") * P("hit"|"football")
$$

$$
= 1/13 * 1/13 * 1/13 * 1/13 * 1/13
$$

$$
= 0.0000350
$$

For the document in $d(7)$, we have

$$
P(c=baseball|d(7)) > P(c=football|d(7))
$$

Therefore, the model judged that it is likely to belong to the baseball category.
That's in line with our intuition!

The notation of $P(category-c | document-d)$ is based on the conditional probability that was mentioned earlier.

You can think of it as follows.

> Given a document $d$, the probability that the document is classified into category c

### Classifying articles with ambiguous categories

Next, for the document $d(8)$, let us consider the probability that
If $d(8)$ is the category of baseball, then

$$
P(c=baseball|d(8))
$$

$$
= P("pass"|"baseball") * P("shoot"|"baseball") * P("hit"|"baseball") * P("home run"|"baseball")
$$

$$
= 1/12 * 1/12 * 4/12 * 2/12
$$

$$
= 8/20736
$$

$$
= 0.0003858
$$

If we assume that $d(8)$ is the category for football, then

$$
P(c=football|d(7))
$$

$$
= P("pass"|"football") * P("shoot"|"football") * P("hit"|"football") * P("home run"|"football")
$$

$$
= 4/13 * 4/13 * 1/13 * 1/13 * 1/13
$$

$$
= 16/28561
$$

$$
= 0.0005602
$$

The results show that the probability of belonging to the football category is slightly higher.
Since there were both football-like words and baseball-like words in the mix, it fits our intuition that they would have roughly the same probability value.

Thus, an intuitive understanding of Naive Bayes is that

> for each class of documents to be discriminated.
> For each class of documents to be discriminated, the probability of occurrence of each word in the document is
> The probability of occurrence of each word in the document is multiplied by the probability of its occurrence in the document.
> For each class, the probability of occurrence of each word in the document is multiplied by the probability of its occurrence.

The result is the class with the highest probability value compared to the other classes.

This may be a little difficult to understand.

> Baseball
> If a large number of words appear in the baseball category, the baseball category will be selected.
> If many words appear in the football category, they are classified into the football category.
> If many words appear in the baseball category, they will be classified into the football category.

That's it. This may be too rough.

In this article, I could not finish the formulation of Naive Bayes.
In the next article, I'd like to formulate it so that it can be applied to more general cases.
