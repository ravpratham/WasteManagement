import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: 'Ashish Sachdeva',
      role: 'Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      bio: 'Sarah has 15+ years of experience in environmental conservation and has led the foundation since its inception in 2015.'
    },
    {
      name: 'Mamshad',
      role: 'Manager',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Michael oversees all waste management operations and ensures efficient resource allocation for maximum impact.'
    },
    {
      name: 'Monika',
      role: '',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      bio: 'Aisha develops and maintains relationships with local communities, governments and partner organizations.'
    },
    {
      name: 'Arin Gupta',
      role: 'Intern',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'David leads our research initiatives and ensures our methods align with the latest environmental science.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl">
            Learn about Green Dream Foundation, our mission, history, and the dedicated team working to revolutionize waste management.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Green Dream Foundation was established in 2015 by a group of environmental scientists and community activists who saw the growing waste management crisis in urban areas. What began as a small initiative in one community has grown into a multi-faceted organization tackling waste management challenges across the country.
              </p>
              <p className="text-gray-700 mb-4">
                Our founders recognized that effective waste management isn't just an environmental issue—it's a public health concern, an economic opportunity, and a social justice imperative. This holistic understanding continues to guide our approach today.
              </p>
              <p className="text-gray-700">
                Over the years, we've expanded from basic waste collection to implementing innovative recycling programs, conducting waste audits, developing educational initiatives, and advising local governments on sustainable waste policies.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg" 
                alt="Green Dream Foundation Team" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission & Values</h2>
            <p className="text-gray-700">
              At Green Dream Foundation, we're guided by a clear mission and strong core values that drive everything we do.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h3 className="text-2xl font-bold mb-4 text-primary-600">Our Mission</h3>
            <p className="text-gray-700 text-lg mb-0">
              To create sustainable waste management solutions that protect the environment, improve public health, and empower communities to take ownership of their waste challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Sustainability</h3>
              <p className="text-gray-700">
                We design solutions that are environmentally sound, economically viable, and socially equitable for long-term impact.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Community Empowerment</h3>
              <p className="text-gray-700">
                We believe that lasting change happens when communities are equipped with knowledge, resources and leadership skills.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Innovation</h3>
              <p className="text-gray-700">
                We constantly seek creative, data-driven approaches to waste management challenges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary-600 text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Transparency</h3>
              <p className="text-gray-700">
                We operate with honesty and openness, sharing our successes, challenges, and learnings with all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Team</h2>
            <p className="text-gray-700">
              Meet the dedicated professionals working to make our vision a reality. Our diverse team brings expertise from environmental science, community development, data analytics, and more.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8">
              Whether you want to volunteer, partner with us, or support our work financially, there are many ways to contribute to our mission.
            </p>
            <Link to="/contact" className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-md font-bold transition-all duration-300 inline-flex items-center">
              Get Involved <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;