#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(__file__))

import missions_logic as logic

def test_function(name, func, *args, expected_type=None, should_fail=False):
    print(f"\n {name} with args: {args}")
    try:
        result = func(*args)
        if should_fail:
            print(f"Failed, result: {result}")
            return False
        if expected_type and not isinstance(result, expected_type):
            print(f"Failed type: {expected_type}, got {type(result)}")
            return False
        print(f"Pass: {result}")
        return True
    except Exception as e:
        if should_fail:
            print(f"Pass: Function failed as expected: {e}")
            return True
        print(f"Failed: Error: {e}")
        return False

def run_tests():    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: getMissionCountByCompany
    print("\n" + "="*20)
    print("getMissionCountByCompany")
    print("="*20)
    
    test_cases = [
        ("Valid company", logic.getMissionCountByCompany, "NASA", int),
        ("Empty string", logic.getMissionCountByCompany, "", int),
        ("None/invalid", logic.getMissionCountByCompany, None, int),
        ("Non-string", logic.getMissionCountByCompany, 123, int),
        ("Non-existent company", logic.getMissionCountByCompany, "NonExistentCorp", int),
    ]
    
    for name, func, arg, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, arg, expected_type=expected_type):
            tests_passed += 1
    
    # Test 2: getSuccessRate
    print("\n" + "="*20)
    print("getSuccessRate")
    print("="*20)
    
    test_cases = [
        ("Valid company", logic.getSuccessRate, "NASA", float),
        ("Empty string", logic.getSuccessRate, "", float),
        ("None/invalid", logic.getSuccessRate, None, float),
        ("Non-string", logic.getSuccessRate, 123, float),
        ("Non-existent company", logic.getSuccessRate, "NonExistentCorp", float),
    ]
    
    for name, func, arg, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, arg, expected_type=expected_type):
            tests_passed += 1
    
    # Test 3: getMissionsByDateRange
    print("\n" + "="*20)
    print("getMissionsByDateRange")
    print("="*20)
    
    test_cases = [
        ("Valid range", logic.getMissionsByDateRange, "2020-01-01", "2020-12-31", list),
        ("Empty start date", logic.getMissionsByDateRange, "", "2020-12-31", list),
        ("Empty end date", logic.getMissionsByDateRange, "2020-01-01", "", list),
        ("Invalid date format", logic.getMissionsByDateRange, "2020/01/01", "2020/12/31", list),
        ("Start after end", logic.getMissionsByDateRange, "2020-12-31", "2020-01-01", list),
        ("Single day", logic.getMissionsByDateRange, "2020-01-01", "2020-01-01", list),
    ]
    
    for name, func, start, end, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, start, end, expected_type=expected_type):
            tests_passed += 1
    
    # Test 4: getTopCompaniesByMissionCount
    print("\n" + "="*20)
    print("getTopCompaniesByMissionCount")
    print("="*20)
    
    test_cases = [
        ("Valid N", logic.getTopCompaniesByMissionCount, 5, list),
        ("N=0", logic.getTopCompaniesByMissionCount, 0, list),
        ("Negative N", logic.getTopCompaniesByMissionCount, -1, list),
        ("Very large N", logic.getTopCompaniesByMissionCount, 1000, list),
        ("Non-integer N", logic.getTopCompaniesByMissionCount, "5", list),
        ("None N", logic.getTopCompaniesByMissionCount, None, list),
    ]
    
    for name, func, n, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, n, expected_type=expected_type):
            tests_passed += 1
    
    # Test 5: getMissionStatusCount
    print("\n" + "="*20)
    print("getMissionStatusCount")
    print("="*20)
    
    test_cases = [
        ("Normal call", logic.getMissionStatusCount, None, dict),
    ]
    
    for name, func, _, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, expected_type=expected_type):
            tests_passed += 1
    
    # Test 6: getMissionsByYear
    print("\n" + "="*20)
    print("getMissionsByYear")
    print("="*20)
    
    test_cases = [
        ("Valid year", logic.getMissionsByYear, 2020, int),
        ("Year too early", logic.getMissionsByYear, 1900, int),
        ("Year too late", logic.getMissionsByYear, 2020, int),
        ("Non integer year", logic.getMissionsByYear, "2020", int),
        ("None year", logic.getMissionsByYear, None, int),
    ]
    
    for name, func, year, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, year, expected_type=expected_type):
            tests_passed += 1
    
    # Test 7: getMostUsedRocket
    print("\n" + "="*20)
    print("getMostUsedRocket")
    print("="*20)
    
    test_cases = [
        ("Normal call", logic.getMostUsedRocket, None, str),
    ]
    
    for name, func, _, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, expected_type=expected_type):
            tests_passed += 1
    
    # Test 8: getAverageMissionsPerYear
    print("\n" + "="*20)
    print("getAverageMissionsPerYear")
    print("="*20)
    
    test_cases = [
        ("Valid range", logic.getAverageMissionsPerYear, 2020, 2021, float),
        ("Same year", logic.getAverageMissionsPerYear, 2020, 2020, float),
        ("Start > End", logic.getAverageMissionsPerYear, 2021, 2020, float),
        ("Invalid start year", logic.getAverageMissionsPerYear, "2020", 2021, float),
        ("Invalid end year", logic.getAverageMissionsPerYear, 2020, "2021", float),
        ("Year too early", logic.getAverageMissionsPerYear, 1900, 2020, float),
        ("Year too late", logic.getAverageMissionsPerYear, 2020, 2020, float),
    ]
    
    for name, func, start, end, expected_type in test_cases:
        total_tests += 1
        if test_function(name, func, start, end, expected_type=expected_type):
            tests_passed += 1
    
    # Summary
    print("Results")
    print(f"Tests passed: {tests_passed}/{total_tests}")
    print(f"Success rate: {(tests_passed/total_tests)*100:.1f}%")
    
    if tests_passed == total_tests:
        print("All test pass.")
        return True
    else:
        print("Some tests failed.")
        return False

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)