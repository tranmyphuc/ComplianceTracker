--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    user_id text,
    system_id text,
    "timestamp" timestamp without time zone DEFAULT now(),
    metadata jsonb
);


ALTER TABLE public.activities OWNER TO neondb_owner;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO neondb_owner;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: ai_systems; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.ai_systems (
    id integer NOT NULL,
    system_id text NOT NULL,
    name text NOT NULL,
    vendor text,
    department text NOT NULL,
    risk_level text NOT NULL,
    risk_score integer,
    implementation_date timestamp without time zone,
    last_assessment_date timestamp without time zone,
    doc_completeness integer DEFAULT 0,
    training_completeness integer DEFAULT 0,
    description text,
    status text DEFAULT 'active'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by text,
    purpose text,
    version text,
    ai_capabilities text,
    training_datasets text,
    usage_context text,
    potential_impact text,
    keywords jsonb DEFAULT '[]'::jsonb,
    expected_lifetime text,
    maintenance_schedule text,
    deployment_scope text
);


ALTER TABLE public.ai_systems OWNER TO neondb_owner;

--
-- Name: ai_systems_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.ai_systems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_systems_id_seq OWNER TO neondb_owner;

--
-- Name: ai_systems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.ai_systems_id_seq OWNED BY public.ai_systems.id;


--
-- Name: alerts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    type text NOT NULL,
    severity text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    system_id text,
    created_at timestamp without time zone DEFAULT now(),
    is_resolved boolean DEFAULT false
);


ALTER TABLE public.alerts OWNER TO neondb_owner;

--
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO neondb_owner;

--
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- Name: deadlines; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.deadlines (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    date timestamp without time zone NOT NULL,
    type text,
    related_system_id text
);


ALTER TABLE public.deadlines OWNER TO neondb_owner;

--
-- Name: deadlines_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.deadlines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deadlines_id_seq OWNER TO neondb_owner;

--
-- Name: deadlines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.deadlines_id_seq OWNED BY public.deadlines.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name text NOT NULL,
    compliance_score integer DEFAULT 0
);


ALTER TABLE public.departments OWNER TO neondb_owner;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO neondb_owner;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    system_id text,
    content text,
    version text,
    status text DEFAULT 'draft'::text,
    created_by text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.documents OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: risk_assessments; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.risk_assessments (
    id integer NOT NULL,
    assessment_id text NOT NULL,
    system_id text NOT NULL,
    assessment_date timestamp without time zone DEFAULT now(),
    status text DEFAULT 'completed'::text NOT NULL,
    risk_level text NOT NULL,
    risk_score integer,
    system_category text,
    prohibited_use_checks jsonb,
    eu_ai_act_articles jsonb,
    compliance_gaps jsonb,
    remediation_actions jsonb,
    evidence_documents jsonb,
    summary_notes text,
    created_by text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.risk_assessments OWNER TO neondb_owner;

--
-- Name: risk_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.risk_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.risk_assessments_id_seq OWNER TO neondb_owner;

--
-- Name: risk_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.risk_assessments_id_seq OWNED BY public.risk_assessments.id;


--
-- Name: training_modules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.training_modules (
    id integer NOT NULL,
    module_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    estimated_time text NOT NULL,
    topics jsonb NOT NULL,
    role_relevance jsonb NOT NULL,
    content jsonb NOT NULL,
    "order" integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.training_modules OWNER TO neondb_owner;

--
-- Name: training_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.training_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_modules_id_seq OWNER TO neondb_owner;

--
-- Name: training_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.training_modules_id_seq OWNED BY public.training_modules.id;


--
-- Name: training_progress; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.training_progress (
    id integer NOT NULL,
    user_id text NOT NULL,
    module_id text NOT NULL,
    completion integer DEFAULT 0,
    assessment_score integer,
    last_attempt_date timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.training_progress OWNER TO neondb_owner;

--
-- Name: training_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.training_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.training_progress_id_seq OWNER TO neondb_owner;

--
-- Name: training_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.training_progress_id_seq OWNED BY public.training_progress.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    uid text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    display_name text,
    role text DEFAULT 'user'::text,
    department text,
    photo_url text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: ai_systems id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_systems ALTER COLUMN id SET DEFAULT nextval('public.ai_systems_id_seq'::regclass);


--
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- Name: deadlines id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deadlines ALTER COLUMN id SET DEFAULT nextval('public.deadlines_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: risk_assessments id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_assessments ALTER COLUMN id SET DEFAULT nextval('public.risk_assessments_id_seq'::regclass);


--
-- Name: training_modules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_modules ALTER COLUMN id SET DEFAULT nextval('public.training_modules_id_seq'::regclass);


--
-- Name: training_progress id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_progress ALTER COLUMN id SET DEFAULT nextval('public.training_progress_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.activities (id, type, description, user_id, system_id, "timestamp", metadata) FROM stdin;
1	system_register	Registered new AI system	admin-01	SGH-AI-001	2025-03-17 13:34:13.785849	\N
2	risk_assessment	Completed risk assessment	admin-01	SGH-AI-002	2025-03-19 13:34:13.785849	\N
3	documentation	Updated technical documentation	admin-01	SGH-AI-003	2025-03-21 13:34:13.785849	\N
4	system_created	New system "Business Intelligence Analytics Platform" was registered	\N	AI-SYS-5621	2025-03-22 15:30:54.829	{"systemName": "Business Intelligence Analytics Platform"}
5	system_created	New system "Business Intelligence Analytics Platform" was registered	\N	AI-SYS-8854	2025-03-22 15:32:39.335	{"systemName": "Business Intelligence Analytics Platform"}
6	system_created	New system "Business Intelligence Analytics Platform" was registered	\N	AI-SYS-4295	2025-03-22 15:32:40.897	{"systemName": "Business Intelligence Analytics Platform"}
9	system_created	New system "Gamma.app AI Presentation Generator" was registered	\N	AI-SYS-6459	2025-03-22 16:50:14.724	{"systemName": "Gamma.app AI Presentation Generator"}
10	system_created	New system "Gamma.app AI Presentation Generator" was registered	\N	AI-SYS-9524	2025-03-22 16:50:14.93	{"systemName": "Gamma.app AI Presentation Generator"}
11	system_created	New system "dfgfgfgff" was registered	\N	AI-SYS-8210	2025-03-22 17:02:49.008	{"systemName": "dfgfgfgff"}
12	system_created	New system "dfgfgfgff" was registered	\N	AI-SYS-3196	2025-03-22 17:02:50.905	{"systemName": "dfgfgfgff"}
13	system_created	New system "Storyteller by Mootion" was registered	\N	AI-SYS-6638	2025-03-22 17:25:09.524	{"systemName": "Storyteller by Mootion"}
14	system_created	New system "ChatGPT" was registered	\N	AI-SYS-1580	2025-03-22 17:36:56.099	{"systemName": "ChatGPT"}
17	system_created	New system "Sider AI" was registered	\N	AI-SYS-2742	2025-03-22 17:59:15.915	{"systemName": "Sider AI"}
20	system_created	New system "Gamma.app" was registered	\N	AI-SYS-5935	2025-03-23 17:10:13.529	{"systemName": "Gamma.app"}
21	system_created	New system "Wordtune " was registered	\N	AI-SYS-4720	2025-03-23 17:33:38.728	{"systemName": "Wordtune "}
22	system_created	New system "claude" was registered	\N	AI-SYS-1523	2025-03-24 06:34:46.093	{"systemName": "claude"}
23	system_created	New system "claude" was registered	\N	AI-SYS-6700	2025-03-24 06:34:46.312	{"systemName": "claude"}
\.


--
-- Data for Name: ai_systems; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.ai_systems (id, system_id, name, vendor, department, risk_level, risk_score, implementation_date, last_assessment_date, doc_completeness, training_completeness, description, status, created_at, updated_at, created_by, purpose, version, ai_capabilities, training_datasets, usage_context, potential_impact, keywords, expected_lifetime, maintenance_schedule, deployment_scope) FROM stdin;
1	SGH-AI-001	Customer Service Chatbot	\N	Customer Service	Limited Risk	35	\N	\N	0	0	AI-powered chatbot for handling customer inquiries	active	2025-03-22 13:33:55.071454	2025-03-22 13:33:55.071454	admin-01	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
2	SGH-AI-002	Predictive Maintenance System	\N	Engineering	High Risk	75	\N	\N	0	0	AI system that predicts equipment failures	active	2025-03-22 13:33:55.071454	2025-03-22 13:33:55.071454	admin-01	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
3	SGH-AI-003	HR Candidate Screening Tool	\N	Human Resources	High Risk	65	\N	\N	0	0	AI tool for initial screening of job applicants	active	2025-03-22 13:33:55.071454	2025-03-22 13:33:55.071454	admin-01	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
4	AI-SYS-5621	Business Intelligence Analytics Platform	DataViz Technologies	Human Resources	Limited	\N	\N	\N	0	0	hdhfhggf grfhytyyy hghgh	active	2025-03-22 15:30:54.785	2025-03-22 15:30:54.795151	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
5	AI-SYS-8854	Business Intelligence Analytics Platform	DataViz Technologies	Human Resources	Limited	\N	\N	\N	0	0	btw please remove our logo imgae and change with word SGH ASIA - EU AI Act 	active	2025-03-22 15:32:36.65	2025-03-22 15:32:39.276697	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
6	AI-SYS-4295	Business Intelligence Analytics Platform	DataViz Technologies	Human Resources	Limited	\N	\N	\N	0	0	btw please remove our logo imgae and change with word SGH ASIA - EU AI Act 	active	2025-03-22 15:32:38.731	2025-03-22 15:32:40.869985	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
7	AI-SYS-6459	Gamma.app AI Presentation Generator	Gamma Technologies, Inc.	Sales	Limited	\N	\N	\N	0	0	Gamma.app is an AI-powered presentation and document creation tool. It assists users in generating visually appealing and informative presentations, documents, and webpages from text prompts or existing content. The system leverages AI to automate the design process, suggest relevant content, refine layouts, and optimize for various presentation formats and platforms. Its purpose is to accelerate content creation, improve the quality and engagement of presentations, and democratize access to professional-level design and communication tools.	active	2025-03-22 16:50:14.006	2025-03-22 16:50:14.673759	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
8	AI-SYS-9524	Gamma.app AI Presentation Generator	Gamma Technologies, Inc.	Sales	Limited	\N	\N	\N	0	0	Gamma.app is an AI-powered presentation and document creation tool. It assists users in generating visually appealing and informative presentations, documents, and webpages from text prompts or existing content. The system leverages AI to automate the design process, suggest relevant content, refine layouts, and optimize for various presentation formats and platforms. Its purpose is to accelerate content creation, improve the quality and engagement of presentations, and democratize access to professional-level design and communication tools.	active	2025-03-22 16:50:14.901	2025-03-22 16:50:14.908251	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
9	AI-SYS-8210	dfgfgfgff	hghghghh	Sales	Limited	\N	\N	\N	0	0	hghgghhgjhj	active	2025-03-22 17:02:46.359	2025-03-22 17:02:48.951234	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
10	AI-SYS-3196	dfgfgfgff	hghghghh	Sales	Limited	\N	\N	\N	0	0	hghgghhgjhj	active	2025-03-22 17:02:48.737	2025-03-22 17:02:50.878895	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
11	AI-SYS-6638	Storyteller by Mootion	Mootion	Marketing	Limited	\N	\N	\N	0	0	Storyteller by Mootion is an AI-powered video creation and storytelling platform that automates the generation of short videos from various inputs, including text scripts, blog posts, and data. The system analyzes provided content, identifies key themes and narratives, and automatically generates video scenes, adds relevant visuals (images, video clips, and animations), and incorporates music and voiceovers to create engaging video content. Its purpose is to streamline video creation, enabling users to quickly and easily produce professional-quality videos for marketing, social media, internal communication, and other purposes without requiring advanced video editing skills.	active	2025-03-22 17:25:08.795	2025-03-22 17:25:09.476062	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
12	AI-SYS-1580	ChatGPT	OpenAI	Sales	Minimal	\N	\N	\N	0	0	ChatGPT is a large language model designed to generate human-quality text for a wide range of tasks. These include, but are not limited to: answering questions, providing summaries, generating creative content (e.g., stories, poems, code), translating languages, engaging in conversational interactions, and providing information on a diverse set of topics. It aims to understand and respond to user inputs in a coherent, relevant, and contextually appropriate manner.	active	2025-03-22 17:36:53.434	2025-03-22 17:36:56.018748	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
13	AI-SYS-2742	Sider AI	Sider AI (hypothetical, as the actual vendor information needs to be verified from their official website or legal documents)	Sales	Minimal	\N	\N	\N	0	0	Sider AI is an AI-powered assistant designed to enhance productivity and access information through a unified interface. It leverages various AI models, including large language models (LLMs), to provide functionalities like: Chatting with different AI models (e.g., GPT-3.5, GPT-4), summarizing content from web pages and documents, generating text in various formats and styles, providing code completion and debugging assistance, enhancing search engine results, translating text, and creating AI-generated art. It aims to streamline workflows and improve user efficiency across various tasks.	active	2025-03-22 17:59:13.212	2025-03-22 17:59:15.863741	\N	\N	\N	\N	\N	\N	\N	[]	\N	\N	\N
14	AI-SYS-5935	Gamma.app	Gamma	Sales	Limited Risk	\N	\N	\N	0	0	Okokook	active	2025-03-23 17:10:13.334	2025-03-23 17:10:13.492649	\N	Presentation and content creation platform with AI assistance	2.0	Natural Language Processing, Content Generation, Image Generation, Layout Design	Text and image datasets, presentation templates	Business presentations, marketing materials, internal communications	Improved productivity, enhanced communication, streamlined content creation	[]			
15	AI-SYS-4720	Wordtune 	AI21 Labs	Sales	Minimal Risk	\N	\N	\N	0	0	Wordtune is an AI-powered writing assistant designed to help users improve the clarity, fluency, and overall quality of their written content. It provides suggestions for rephrasing sentences, correcting grammar and spelling errors, adjusting tone, and shortening or lengthening text. The system aims to enhance communication effectiveness across various contexts, including professional writing, academic assignments, and personal correspondence.	active	2025-03-23 17:33:38.036	2025-03-23 17:33:38.665787	\N	Wordtune is an AI-powered writing assistant designed to help users improve the clarity, fluency, and overall quality of their written content. It provides suggestions for rephrasing sentences, correcting grammar and spelling errors, adjusting tone, and shortening or lengthening text. The system aims to enhance communication effectiveness across various contexts, including professional writing, academic assignments, and personal correspondence.	3.2.1	Natural Language Processing (NLP), Natural Language Generation (NLG), Text Summarization, Grammar and Spell Checking, Sentiment Analysis, Machine Translation (implicitly, through rephrasing suggestions), Text Style Transfer	Large corpus of text and code, Academic papers, News articles, Books, Web content, General internet data, Potentially user-provided text for fine-tuning (if applicable and with consent)	Wordtune is typically used as a browser extension or web application integrated into writing workflows. It can be used for writing emails, reports, articles, essays, and other forms of text-based communication. It is used by individuals, professionals, and students to enhance their writing skills and produce higher-quality content.	Wordtune can positively impact individuals by improving their writing skills, saving time, and enhancing communication effectiveness. It can benefit organizations by improving the quality of their written communications and increasing productivity. However, potential negative impacts include over-reliance on the tool, potential for homogenization of writing styles, and algorithmic bias if the underlying models are not carefully trained and monitored. There is also a risk of misuse if the tool is used to generate misleading or deceptive content, though this is less direct than AI systems designed specifically for misinformation.	[]			
16	AI-SYS-1523	claude	Anthropic	IT	minimal	\N	\N	\N	0	0	Claude is a conversational AI assistant designed to engage in natural and helpful dialogues, generate creative content, answer questions, and assist with a variety of tasks. It is trained to be harmless, honest, and helpful, and to avoid generating inappropriate or misleading information. Its primary purpose is to provide a versatile and reliable AI assistant that can be integrated into various applications and workflows to enhance productivity and improve user experiences.	active	2025-03-24 06:34:43.429	2025-03-24 06:34:46.037882	\N	Claude is a conversational AI assistant designed to engage in natural and helpful dialogues, generate creative content, answer questions, and assist with a variety of tasks. It is trained to be harmless, honest, and helpful, and to avoid generating inappropriate or misleading information. Its primary purpose is to provide a versatile and reliable AI assistant that can be integrated into various applications and workflows to enhance productivity and improve user experiences.	3.0	Natural Language Processing (NLP), Natural Language Generation (NLG), Machine Learning (ML), Dialogue Management, Text Summarization, Question Answering, Code Generation (to a limited extent)	Large-scale text and code datasets, Books, Articles, Web pages, Code repositories, Proprietary datasets curated by Anthropic	Customer service chatbots, Virtual assistants, Content creation tools, Research assistants, Software development support, Educational platforms, Internal knowledge bases, Personal productivity tools	Improved customer service efficiency, Increased productivity for content creators and researchers, Enhanced access to information, Automation of routine tasks, Potential for misinformation or biased responses (mitigated by safety training), Ethical concerns related to AI bias and job displacement, Dependence on AI systems for decision-making, Data privacy concerns if personal data is processed	[]			
17	AI-SYS-6700	claude	Anthropic	IT	minimal	\N	\N	\N	0	0	Claude is a conversational AI assistant designed to engage in natural and helpful dialogues, generate creative content, answer questions, and assist with a variety of tasks. It is trained to be harmless, honest, and helpful, and to avoid generating inappropriate or misleading information. Its primary purpose is to provide a versatile and reliable AI assistant that can be integrated into various applications and workflows to enhance productivity and improve user experiences.	active	2025-03-24 06:34:44.143	2025-03-24 06:34:46.288224	\N	Claude is a conversational AI assistant designed to engage in natural and helpful dialogues, generate creative content, answer questions, and assist with a variety of tasks. It is trained to be harmless, honest, and helpful, and to avoid generating inappropriate or misleading information. Its primary purpose is to provide a versatile and reliable AI assistant that can be integrated into various applications and workflows to enhance productivity and improve user experiences.	3.0	Natural Language Processing (NLP), Natural Language Generation (NLG), Machine Learning (ML), Dialogue Management, Text Summarization, Question Answering, Code Generation (to a limited extent)	Large-scale text and code datasets, Books, Articles, Web pages, Code repositories, Proprietary datasets curated by Anthropic	Customer service chatbots, Virtual assistants, Content creation tools, Research assistants, Software development support, Educational platforms, Internal knowledge bases, Personal productivity tools	Improved customer service efficiency, Increased productivity for content creators and researchers, Enhanced access to information, Automation of routine tasks, Potential for misinformation or biased responses (mitigated by safety training), Ethical concerns related to AI bias and job displacement, Dependence on AI systems for decision-making, Data privacy concerns if personal data is processed	[]			
\.


--
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.alerts (id, type, severity, title, description, system_id, created_at, is_resolved) FROM stdin;
1	compliance	Critical	Documentation Gap	Technical documentation is incomplete	SGH-AI-002	2025-03-20 13:34:19.17799	t
2	security	Critical	Potential Data Leakage	System may expose sensitive data	SGH-AI-003	2025-03-21 13:34:19.17799	t
\.


--
-- Data for Name: deadlines; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.deadlines (id, title, description, date, type, related_system_id) FROM stdin;
1	Technical Documentation	Complete technical documentation for EU AI Act compliance	2025-04-01 13:34:24.347446	compliance	SGH-AI-001
2	Risk Assessment Update	Update risk assessment following new model deployment	2025-04-06 13:34:24.347446	assessment	SGH-AI-002
3	Compliance Certification	Submit for EU AI Act compliance certification	2025-04-21 13:34:24.347446	certification	SGH-AI-003
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.departments (id, name, compliance_score) FROM stdin;
1	Engineering	87
2	Marketing	65
3	Human Resources	92
4	Customer Service	78
5	Finance	56
6	Executive	90
7	Information Technology	95
8	Research & Development	82
10	IT	85
11	R&D	75
12	HR	90
13	Legal	95
14	Operations	70
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.documents (id, title, type, system_id, content, version, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: risk_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.risk_assessments (id, assessment_id, system_id, assessment_date, status, risk_level, risk_score, system_category, prohibited_use_checks, eu_ai_act_articles, compliance_gaps, remediation_actions, evidence_documents, summary_notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: training_modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.training_modules (id, module_id, title, description, estimated_time, topics, role_relevance, content, "order", created_at, updated_at) FROM stdin;
3	1	EU AI Act Introduction	Introduction to the EU AI Act, its scope, and key provisions	20-30 minutes	["Overview", "Scope", "Key Definitions", "Risk-Based Approach"]	{"user": "Medium", "operator": "High", "developer": "High", "decision_maker": "High"}	{"sections": [{"title": "What is the EU AI Act?", "content": "<p>The EU AI Act is a comprehensive legal framework specifically regulating artificial intelligence systems in the European Union. It establishes a risk-based approach that categorizes AI applications based on their potential risk level.</p><p>The regulation aims to ensure AI systems used in the EU are safe and respectful of fundamental rights.</p>"}, {"title": "Key Objectives", "content": "<p>The EU AI Act has several key objectives:</p><ul><li>Ensure AI systems placed on the EU market are safe</li><li>Respect fundamental rights and EU values</li><li>Ensure legal certainty to facilitate innovation</li><li>Enhance governance and enforcement of AI regulations</li><li>Promote development of a single market for lawful, safe and trustworthy AI applications</li></ul>"}, {"title": "Risk-Based Approach", "content": "<p>The EU AI Act classifies AI systems into four risk categories:</p><ol><li><strong>Unacceptable Risk</strong>: Systems posing a clear threat to people's safety, livelihoods, or rights (prohibited)</li><li><strong>High Risk</strong>: Systems with significant potential impact on health, safety, or fundamental rights</li><li><strong>Limited Risk</strong>: Systems with specific transparency obligations</li><li><strong>Minimal Risk</strong>: All other AI systems with minimal regulatory requirements</li></ol>"}], "assessments": [{"options": ["One-size-fits-all approach", "Self-certification approach", "Risk-based approach", "Voluntary code of conduct"], "question": "What is the primary approach used in the EU AI Act to regulate AI systems?", "correctAnswer": "Risk-based approach"}, {"options": ["Two", "Three", "Four", "Five"], "question": "How many risk categories does the EU AI Act establish?", "correctAnswer": "Four"}, {"options": ["Ensure AI systems are safe", "Ban all forms of AI development", "Respect fundamental rights", "Facilitate innovation"], "question": "Which of the following is NOT a key objective of the EU AI Act?", "correctAnswer": "Ban all forms of AI development"}]}	1	2025-03-23 01:12:30.942373	2025-03-23 01:12:30.942373
4	2	Risk Classification System	Understanding the risk categories and how to classify AI systems	25-35 minutes	["Prohibited Uses", "High-Risk Systems", "Limited Risk", "Minimal Risk"]	{"user": "Medium", "operator": "High", "developer": "High", "decision_maker": "High"}	{"sections": [{"title": "Understanding AI Risk Categories", "content": "<p>The EU AI Act classifies AI systems into four distinct risk categories:</p><ol><li><strong>Unacceptable Risk (Prohibited)</strong>: AI systems deemed to pose a clear threat to safety, livelihoods, or rights of people.</li><li><strong>High Risk</strong>: AI systems that may cause significant harm to health, safety, or fundamental rights.</li><li><strong>Limited Risk</strong>: AI systems with specific transparency requirements.</li><li><strong>Minimal Risk</strong>: All other AI systems that pose little to no risk.</li></ol>"}, {"title": "Prohibited AI Practices", "content": "<p>The following AI practices are prohibited under the EU AI Act:</p><ul><li>Social scoring systems used by public authorities</li><li>Real-time remote biometric identification in publicly accessible spaces for law enforcement (with limited exceptions)</li><li>AI systems that use subliminal or manipulative techniques to distort behavior</li><li>AI that exploits vulnerabilities of specific groups (age, disability, etc.)</li></ul>"}, {"title": "High-Risk AI Systems", "content": "<p>High-risk AI systems require the most comprehensive compliance measures. An AI system is considered high-risk if it falls into one of two categories:</p><ol><li><strong>AI systems as safety components of products</strong> that are subject to third-party conformity assessment under existing product safety legislation (e.g., medical devices, machinery, toys)</li><li><strong>Stand-alone AI systems</strong> in specific areas such as biometric identification, critical infrastructure, education, employment, law enforcement, and migration control</li></ol>"}], "assessments": [{"options": ["A video game recommendation system", "An AI system used for recruitment and candidate selection", "A smart home control system", "A music creation AI application"], "question": "Which of the following AI systems would most likely be classified as high-risk?", "correctAnswer": "An AI system used for recruitment and candidate selection"}, {"options": ["Social scoring by governments", "AI-powered customer service chatbots", "Systems exploiting vulnerabilities of specific groups", "Real-time facial recognition in public spaces (with few exceptions)"], "question": "Which practice is NOT prohibited under the EU AI Act?", "correctAnswer": "AI-powered customer service chatbots"}, {"options": ["Risk management system", "Technical documentation", "Human oversight", "Open-source code publication"], "question": "For high-risk AI systems, which requirement is NOT mandatory?", "correctAnswer": "Open-source code publication"}]}	2	2025-03-23 01:12:30.98209	2025-03-23 01:12:30.98209
5	3	Technical Requirements	Technical requirements for high-risk AI systems	40-50 minutes	["Data Governance", "Technical Documentation", "Record Keeping", "Accuracy & Robustness"]	{"user": "Low", "operator": "High", "developer": "High", "decision_maker": "Medium"}	{"sections": [{"title": "Data Governance Requirements", "content": "<p>High-risk AI systems must implement robust data governance practices:</p><ul><li>Training, validation, and testing data must be relevant, representative, and free of errors</li><li>Data must account for characteristics of specific demographic groups</li><li>Data bias must be identified and mitigated</li><li>Personal data must be protected in accordance with privacy regulations</li></ul>"}, {"title": "Technical Documentation", "content": "<p>Technical documentation must include:</p><ul><li>General description of the system and its intended purpose</li><li>Design specifications including architecture, algorithms, and data requirements</li><li>Development process description and validation procedures</li><li>Risk management systems and mitigation measures</li><li>Testing and validation procedures</li></ul>"}, {"title": "Record-Keeping Requirements", "content": "<p>High-risk AI systems must include:</p><ul><li>Automatic recording of events (logging) throughout operation</li><li>Traceability of system operations</li><li>Ability to monitor for incidents and malfunctions</li><li>Records that allow for post-market monitoring</li></ul>"}], "assessments": [{"options": ["Using representative data", "Testing data for bias", "Using only synthetic data", "Ensuring data quality"], "question": "Which of the following is NOT a data governance requirement under the EU AI Act?", "correctAnswer": "Using only synthetic data"}, {"options": ["Only design specifications", "Only details about training data sources", "Only risk management measures", "All of the development process, design, and risk management"], "question": "What does the technical documentation requirement for high-risk AI systems include?", "correctAnswer": "All of the development process, design, and risk management"}, {"options": ["Manual record-keeping only", "Continuous manual auditing", "Automatic recording of events during operation", "Monthly reporting of operations"], "question": "What type of logging is required for high-risk AI systems?", "correctAnswer": "Automatic recording of events during operation"}]}	3	2025-03-23 01:12:31.014414	2025-03-23 01:12:31.014414
\.


--
-- Data for Name: training_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.training_progress (id, user_id, module_id, completion, assessment_score, last_attempt_date, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, uid, username, email, password, display_name, role, department, photo_url, created_at) FROM stdin;
1	admin-01	admin	admin@sghasia.com	password123	Admin User	admin	Executive	\N	2025-03-22 13:32:06.099322
2	admin-uid-123	admin	admin@example.com	240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9	Admin User	admin	IT	\N	2025-03-23 01:05:00.982
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.activities_id_seq', 23, true);


--
-- Name: ai_systems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.ai_systems_id_seq', 17, true);


--
-- Name: alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.alerts_id_seq', 2, true);


--
-- Name: deadlines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.deadlines_id_seq', 3, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.departments_id_seq', 14, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.risk_assessments_id_seq', 1, false);


--
-- Name: training_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.training_modules_id_seq', 5, true);


--
-- Name: training_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.training_progress_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: ai_systems ai_systems_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_systems
    ADD CONSTRAINT ai_systems_pkey PRIMARY KEY (id);


--
-- Name: ai_systems ai_systems_system_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_systems
    ADD CONSTRAINT ai_systems_system_id_unique UNIQUE (system_id);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: deadlines deadlines_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deadlines
    ADD CONSTRAINT deadlines_pkey PRIMARY KEY (id);


--
-- Name: departments departments_name_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_unique UNIQUE (name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: risk_assessments risk_assessments_assessment_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT risk_assessments_assessment_id_unique UNIQUE (assessment_id);


--
-- Name: risk_assessments risk_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT risk_assessments_pkey PRIMARY KEY (id);


--
-- Name: training_modules training_modules_module_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_modules
    ADD CONSTRAINT training_modules_module_id_unique UNIQUE (module_id);


--
-- Name: training_modules training_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_modules
    ADD CONSTRAINT training_modules_pkey PRIMARY KEY (id);


--
-- Name: training_progress training_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT training_progress_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_uid_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_uid_unique UNIQUE (uid);


--
-- Name: activities activities_system_id_ai_systems_system_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_system_id_ai_systems_system_id_fk FOREIGN KEY (system_id) REFERENCES public.ai_systems(system_id);


--
-- Name: activities activities_user_id_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_users_uid_fk FOREIGN KEY (user_id) REFERENCES public.users(uid);


--
-- Name: ai_systems ai_systems_created_by_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.ai_systems
    ADD CONSTRAINT ai_systems_created_by_users_uid_fk FOREIGN KEY (created_by) REFERENCES public.users(uid);


--
-- Name: alerts alerts_system_id_ai_systems_system_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_system_id_ai_systems_system_id_fk FOREIGN KEY (system_id) REFERENCES public.ai_systems(system_id);


--
-- Name: deadlines deadlines_related_system_id_ai_systems_system_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.deadlines
    ADD CONSTRAINT deadlines_related_system_id_ai_systems_system_id_fk FOREIGN KEY (related_system_id) REFERENCES public.ai_systems(system_id);


--
-- Name: documents documents_created_by_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_created_by_users_uid_fk FOREIGN KEY (created_by) REFERENCES public.users(uid);


--
-- Name: documents documents_system_id_ai_systems_system_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_system_id_ai_systems_system_id_fk FOREIGN KEY (system_id) REFERENCES public.ai_systems(system_id);


--
-- Name: risk_assessments risk_assessments_created_by_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT risk_assessments_created_by_users_uid_fk FOREIGN KEY (created_by) REFERENCES public.users(uid);


--
-- Name: risk_assessments risk_assessments_system_id_ai_systems_system_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_assessments
    ADD CONSTRAINT risk_assessments_system_id_ai_systems_system_id_fk FOREIGN KEY (system_id) REFERENCES public.ai_systems(system_id);


--
-- Name: training_progress training_progress_module_id_training_modules_module_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT training_progress_module_id_training_modules_module_id_fk FOREIGN KEY (module_id) REFERENCES public.training_modules(module_id);


--
-- Name: training_progress training_progress_user_id_users_uid_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.training_progress
    ADD CONSTRAINT training_progress_user_id_users_uid_fk FOREIGN KEY (user_id) REFERENCES public.users(uid);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

