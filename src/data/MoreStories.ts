
// Making More Health
import hlImg1 from '../assets/Making More Health/1.png'
import hlImg2 from '../assets/Making More Health/2.jpg'
import hlImg3 from '../assets/Making More Health/3.jpg'
import hlImg4 from '../assets/Making More Health/4.jpg'
import hlImg5 from '../assets/Making More Health/5.jpg'
import hlImg6 from '../assets/Making More Health/6.jpeg'
import hlImg7 from '../assets/Making More Health/7.jpeg'
import hlImg8 from '../assets/Making More Health/8.jpeg'
import hlImg9 from '../assets/Making More Health/9.jpg'
import hlCoverImg from '../assets/Making More Health/00_The cover.jpeg'

// Volunteering Activities
import vlImg1 from '../assets/volunteering/1.jpg'
import vlImg2 from '../assets/volunteering/2.jpg'
import vlImg4 from '../assets/volunteering/4.jpg'
import vlImg5 from '../assets/volunteering/5.jpg'
import vlImg6 from '../assets/volunteering/6.jpg'
import vlImg7 from '../assets/volunteering/7.jpg'
import vlImg8 from '../assets/volunteering/8.jpg'
import vlImg9 from '../assets/volunteering/9.jpg'
import vlImg11 from '../assets/volunteering/11.jpg'
import vlImg12 from '../assets/volunteering/12.jpg'
import vlImg13 from '../assets/volunteering/13.jpg'
import vlImg15 from '../assets/volunteering/15.jpg'
import vlImg16 from '../assets/volunteering/16.jpg'
import vlImg17 from '../assets/volunteering/17.jpg'
import vlImg18 from '../assets/volunteering/18.jpg'
import vlImg19 from '../assets/volunteering/19.jpg'
import vlImg20 from '../assets/volunteering/20.jpg'
import vlImg21 from '../assets/volunteering/21.jpg'
import vlImg22 from '../assets/volunteering/22.jpg'
import vlImg23 from '../assets/volunteering/37.jpg'
import vlImg24 from '../assets/volunteering/38.jpg'
import vlImg25 from '../assets/volunteering/39.jpg'
import vlImg26 from '../assets/volunteering/40.jpg'
import vlVideo from '../assets/volunteering/BI_Faces of Change.mp4'
import vlVideoThump from '../assets/volunteering/BI_Faces of Change thump.png'



import vlCoverImg from '../assets/volunteering/00_The cover .jpg' // Add this if you have a cover image



export const storyData = [
    {   
        id : 1,
        title : "Volunteering Activities",
        text : `To date, over 1,000 employees actively participated in hands-on and skills-based
        volunteering work. Their collective efforts reached far, positively impacting more than 4,000
        individuals across the region. Initiatives ranged from planting activities to working with
        vulnerable groups across the region. The success of the volunteer initiatives is testament to the
        support of IMETA leadership team and the SD4G champions who work relentlessly to
        make these opportunities available.`,
        coverImage : vlCoverImg,

        videos: [
                    {
                        src: vlVideo,
                        thumb: vlVideoThump,
                        caption: "Faces of Change",
                    },
                    
                    
                ],


        images : [
            vlImg1,
            vlImg2,
            vlImg4,
            vlImg5,
            vlImg6,
            vlImg7,
            vlImg8,
            vlImg9,
            vlImg11,
            vlImg12,
            vlImg13,
            vlImg15,
            vlImg16,
            vlImg17,
            vlImg18,
            vlImg19,
            vlImg20,
            vlImg21,
            vlImg22,
            vlImg26,
            vlImg23,
            vlImg24,
            vlImg25,
        ],
        lists: [
            {
                listHead: "In 2025, we are ",
                listPoints: [
                    "Planning to establish a “Giving Back Month” across all IMETA.",
                    "Link all our activities to SD4G",
                    "Collaborate with Ashoka to hold a series a webinars and raise awareness about Diversity, Equity and Inclusion  ",
                ]
            },
            {
                listHead: "In 2030, we aim to ",
                listPoints: [
                    "Engage 2,500 colleagues in volunteering activities",
                    "Ensure a 40% female workforce with 30% of those in supervisory positions",
                    "Include a 55% rate of generation Y in supervisory roles, while 5% of employees are generation Z",
                ]
            }
        ]
    },
    {   
        id : 2,
        title : "Making More Health",
        text : `To date, 800 colleagues from the IMETA region have registered on Making More Health Connect platform and every month, an average of 15 individuals are actively engaged with social entrepreneurs. In 2023, 3 colleagues from IMETA participated in Making More Health Leadership Week and 2 colleagues participated in 2024. In total, 48 IMETA employees have mentored 10 different social entrepreneurs in Boehringer Ingelheim’s incubator, accelerator and social engagement programs.`,
        coverImage : hlCoverImg,
        images : [
            hlImg1,
            hlImg2,
            hlImg3,
            hlImg4,
            hlImg5,
            hlImg6,
            hlImg7,
            hlImg8,
            hlImg9,
        ],
        lists: [
            
        ]
    },
]
