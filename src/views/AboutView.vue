<template>
  <div class="about-page">
    <div class="page-container">
      <h1>About DTT</h1>

      <section class="mission-section">
        <h2>Our Mission</h2>
        <p>
          DTT is committed to delivering innovative digital solutions that transform businesses and
          enhance user experiences. We believe in the power of technology to create meaningful
          connections between people and the spaces they call home.
        </p>
        <p>
          Our real estate platform represents our dedication to making property search and
          management more accessible, intuitive, and efficient for both buyers and sellers in
          today's dynamic market.
        </p>
      </section>

      <section class="services-section">
        <h2>What We Do</h2>
        <div class="services-grid">
          <div class="service-card">
            <h3>Digital Innovation</h3>
            <p>
              We create cutting-edge digital solutions that push the boundaries of what's possible
              in technology.
            </p>
          </div>
          <div class="service-card">
            <h3>Real Estate Technology</h3>
            <p>
              Our platforms revolutionize how people discover, evaluate, and connect with their
              perfect properties.
            </p>
          </div>
          <div class="service-card">
            <h3>User Experience</h3>
            <p>
              We prioritize intuitive design and seamless user interactions in everything we build.
            </p>
          </div>
        </div>
      </section>

      <footer class="dtt-footer">
        <div class="footer-content">
          <img src="/images/dtt-logo.png" alt="DTT Logo" class="dtt-logo" />
          <div class="company-info">
            <p class="company-name">By DTT</p>
            <a
              href="https://www.d-tt.nl/en/"
              target="_blank"
              rel="noopener noreferrer"
              class="company-website"
            >
              www.d-tt.nl
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page logic will be implemented here
</script>

<style scoped>
.about-page {
  padding-top: 90px; /* Account for fixed header */
  min-height: 100vh;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: var(--primary-color, #eb5440);
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: start;
}

h2 {
  color: var(--text-primary, #000000);
  font-size: 2rem;
  margin-bottom: 1.5rem;
  margin-top: 3rem;
}

h3 {
  color: var(--primary-color, #eb5440);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

h4 {
  color: var(--text-primary, #000000);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

p {
  color: var(--text-secondary, #4a4b4c);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.mission-section,
.services-section {
  margin-bottom: 3rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.service-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border-left: 4px solid var(--primary-color, #eb5440);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}


.dtt-footer {
  margin-top: 4rem;
  padding: 2rem 0;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.dtt-logo {
  height: 60px;
  width: auto;
}

.company-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.company-name {
  font-weight: 600;
  color: var(--text-primary, #000000);
  margin: 0;
  font-size: 1.1rem;
}

.company-website {
  color: var(--primary-color, #eb5440);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;
  margin: 0;
}

.company-website:hover {
  color: #d63c2a;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .about-page {
    padding-top: 80px;
  }

  .page-container {
    padding: 16px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 2rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .service-card {
    padding: 1.5rem;
  }

  .careers-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .career-item {
    padding: 1rem;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .company-info {
    align-items: center;
  }

  .dtt-logo {
    height: 50px;
  }
}
</style>
