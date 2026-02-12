import React from 'react';

const SEOContent = () => {
    return (
        <div className="seo-content-container">

            <section className="seo-section" id="what-is-bmi">
                <h2>What is BMI?</h2>
                <p>
                    Body Mass Index (BMI) is a simple calculation using a person's height and weight.
                    The formula is BMI = kg/m² where kg is a person's weight in kilograms and m² is their height in metres squared.
                    A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9.
                    BMI applies to most adults 18-65 years.
                </p>
            </section>

            <section className="seo-section" id="how-it-works">
                <h2>How This BMI Calculator Works</h2>
                <p>
                    Our free BMI Calculator allows you to calculate your Body Mass Index (BMI) using both metric (kg, cm)
                    and imperial (lbs, ft/in) units. Simply enter your gender, age, weight, and height to get an instant
                    calculation of your BMI score along with a classification of your weight status (Underweight, Normal, Overweight, or Obese).
                </p>
            </section>

            <section className="seo-section" id="bmi-categories">
                <h2>BMI Categories</h2>
                <div className="categories-grid">
                    <div className="category-card" style={{ borderColor: '#FFD700' }}>
                        <h3>Underweight</h3>
                        <p>BMI less than 18.5</p>
                    </div>
                    <div className="category-card" style={{ borderColor: '#32CD32' }}>
                        <h3>Normal Weight</h3>
                        <p>BMI between 18.5 and 24.9</p>
                    </div>
                    <div className="category-card" style={{ borderColor: '#FFA500' }}>
                        <h3>Overweight</h3>
                        <p>BMI between 25 and 29.9</p>
                    </div>
                    <div className="category-card" style={{ borderColor: '#FF0000' }}>
                        <h3>Obese</h3>
                        <p>BMI 30 or greater</p>
                    </div>
                </div>
            </section>

            <section className="seo-section" id="faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-item">
                    <h3>Is BMI accurate for everyone?</h3>
                    <p>
                        BMI is a useful screening tool, but it has limitations. It does not differentiate between muscle and fat.
                        Athletes with high muscle mass may have a high BMI but not be overweight. It also doesn't account for age,
                        sex, or ethnicity variations in body composition.
                    </p>
                </div>
                <div className="faq-item">
                    <h3>What is a healthy BMI for women vs men?</h3>
                    <p>
                        The standard BMI categories are the same for men and women. However, body composition (muscle vs fat)
                        differs between the sexes. Women typically have more body fat than men at the same BMI.
                    </p>
                </div>
                <div className="faq-item">
                    <h3>Can I use this calculator for children?</h3>
                    <p>
                        This calculator is designed for adults (18+). For children and teens, BMI needs to be interpreted relative
                        to other children of the same age and sex (BMI-for-age percentiles).
                    </p>
                </div>
            </section>

            <section className="seo-section internal-link">
                <p>Looking for more tools? Check out my <a href="https://adithyan-phi.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>.</p>
            </section>

        </div>
    );
};

export default SEOContent;
