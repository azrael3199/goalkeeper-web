-- Initial dev seed data
DO $$
DECLARE
    user1 UUID := gen_random_uuid();
    user2 UUID := gen_random_uuid();
    user3 UUID := gen_random_uuid();
    user4 UUID := gen_random_uuid();
    user5 UUID := gen_random_uuid();
    
    comm1 UUID := gen_random_uuid();
    comm2 UUID := gen_random_uuid();
    
    lib1 UUID := gen_random_uuid();
    
    goal1 UUID := gen_random_uuid();
    goal2 UUID := gen_random_uuid();
    goal3 UUID := gen_random_uuid();

    task1 UUID := gen_random_uuid();
BEGIN
    INSERT INTO users (id, email, display_name, level, total_xp, coins) VALUES
    (user1, 'user1@test.com', 'Alice Test', 5, 2000, 500),
    (user2, 'user2@test.com', 'Bob Test', 2, 500, 100),
    (user3, 'user3@test.com', 'Charlie Test', 1, 100, 0),
    (user4, 'user4@test.com', 'Diana Test', 10, 5000, 1000),
    (user5, 'user5@test.com', 'Eve Test', 3, 800, 200);

    INSERT INTO communities (id, name, description, privacy, created_by) VALUES
    (comm1, 'Fitness Heroes', 'Accountability for gym bros', 'open', user1),
    (comm2, 'Indie Hackers', 'Ship everyday', 'open', user4);

    INSERT INTO community_members (community_id, user_id, role) VALUES
    (comm1, user1, 'admin'),
    (comm1, user2, 'member'),
    (comm1, user3, 'member'),
    (comm2, user4, 'admin'),
    (comm2, user5, 'member');

    INSERT INTO goals (id, user_id, community_id, title, target_date, status, privacy) VALUES
    (goal1, user1, comm1, 'Get shredded by summer', '2026-06-01', 'active', 'community'),
    (goal2, user2, comm1, 'Run a marathon', '2026-05-01', 'active', 'community'),
    (goal3, user4, NULL, 'Learn Go', '2026-12-31', 'active', 'private');

    INSERT INTO buddy_assignments (community_id, goal_id, user_id, buddy_id, rotation_start, rotation_end) VALUES
    (comm1, goal1, user1, user2, now(), now() + interval '14 days'),
    (comm1, goal2, user2, user1, now(), now() + interval '14 days');

    INSERT INTO tasks (id, goal_id, user_id, title, type, xp_value, coin_value) VALUES
    (task1, goal1, user1, 'Go to the gym', 'one_time', 20, 20);
    
    INSERT INTO store_items (name, category, rarity, coin_cost) VALUES 
    ('Golden Frame', 'card_theme', 'epic', 500),
    ('Noob Title', 'title', 'common', 50);

END $$;
